/**
 * @fileoverview Command parsing and execution service for scraping operations
 * @module /src/scrape-parse.js
 *
 * Handles frontend command requests, parses parameters, and executes the appropriate
 * scraping operations for articles, pictures, or both with configurable options.
 */

import CONFIG from "../config/scrape-config.js";

import { scrapeArticlesClick, runScrapeArticles } from "./articles/articles-scrape.js";
import { runPostArticles } from "./articles/articles-post.js";
import { scrapePicsClick, runScrapePics } from "./pics/pics-scrape.js";

/**
 * Parses and processes commands from frontend request
 * @function parseCommand
 * @param {Object} req.body - Request body containing command parameters
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with command results
 */
export const parseCommand = async (req, res) => {
  const inputParams = await setInputParamsDefaults(req.body);

  //GET NEW DATA FIRST / HERE (returns null if off)
  await runGetNewData(inputParams);

  //run command based on input
  let data = "";
  switch (inputParams.scrapeType) {
    case "scrapePics":
      data = await scrapePicsClick(inputParams);
      break;

    case "scrapeBoth":
    case "scrapeArticles":
      data = await scrapeArticlesClick(inputParams);
      break;

    case "scrapeURL":
      data = await runScrapeURL(inputParams);
      break;

    case "restartAuto":
      console.log("PARSER");
      data = await runRestartAutoScraper(inputParams);
      break;
  }

  //check if tg return
  data = await displayTG(data);

  //check if empty return
  data = await checkIfEmpty(data);

  return res.json(data);
};

/**
 * Sets default values for any missing input parameters
 * @function setInputParamsDefaults
 * @param {Object} inputParams - Raw input parameters from request
 * @returns {Promise<Object>} Input parameters with defaults applied
 */
const setInputParamsDefaults = async (inputParams) => {
  const returnObj = { ...inputParams }; //destructure input

  const defaultInput = {
    scrapeType: CONFIG.defaultScrapeType,
    scrapeTo: CONFIG.defaultScrapeTo,
    tgId: CONFIG.defaultTgId, //forwardTest53
    howMany: CONFIG.defaultHowMany,
    pullNewData: CONFIG.defaultPullNew,
  };

  //if input exists move on
  for (let key1 in inputParams) {
    if (inputParams[key1] !== "" && inputParams[key1] !== 0) {
      continue;
    }

    for (let key2 in defaultInput) {
      if (key2 === key1) {
        returnObj[key1] = defaultInput[key2];
      }
    }
  }
  return returnObj;
};

/**
 * Runs a one-time data scraping operation of either pics OR articles OR both
 * @function runGetNewData
 * @param {Object} inputParams - Input parameters
 * @param {string} inputParams.pullNewData - Whether to pull new data ("yesNewData" or "noNewData")
 * @param {string} inputParams.scrapeType - Type of scrape to perform
 * @returns {Promise<boolean|null>} True when process completes, null if no action taken
 */
export const runGetNewData = async (inputParams) => {
  const { pullNewData, scrapeType } = inputParams;

  //check if get new data on
  if (pullNewData === "noNewData") return null;

  //run get new data based on type
  switch (scrapeType) {
    case "scrapeArticles":
      await runScrapeArticles();
      console.log("FINISHED SCRAPING ARTICLES");
      break;

    case "scrapePics":
      await runScrapePics();
      console.log("FINISHED SCRAPING PICS");
      break;

    case "scrapeBoth":
      await runScrapeArticles();
      console.log("FINISHED GETTING PICS");
      await runScrapePics();
      console.log("FINISHED FUCKER");
      break;
  }

  console.log("FINISHED GETTING NEW DATA");
  return true;
};

/**
 * Restarts the automatic scraper process for pics AND articles
 * @function runRestartAutoScraper
 * @param {Object} inputParams - Input parameters (currently unused) //WILL FIX
 * @returns {Promise<boolean>} True when process completes
 */
export const runRestartAutoScraper = async (inputParams) => {
  //MAKE WAY TO HANDLE SETTING TG ID

  //HAVE IT RESTART HOURLY SCRAPER, JUST GETTING NEW DATA FOR TESTING
  await runScrapeArticles();
  console.log("FINISHED GETTING PICS");
  await runPostArticles();
  console.log("FINISHED POSTING PICS");
  await runScrapePics();
  console.log("FINISHED FUCKER");

  return true;
};

//TODO below function
/**
 * Scrapes content from a specific URL (placeholder function)
 * @function runScrapeURL
 * @param {Object} inputParams - Input parameters
 * @returns {Promise<void>}
 */
export const runScrapeURL = async () => {
  console.log("scrapeURL");
};

//---------------

//PUT ELSEWHEREs
export const displayTG = async (data) => {
  const { scrapeTo, scrapeType } = data;

  //return data if not scraping to TG
  if (scrapeTo !== "displayTG") return data;

  //otherwise
  switch (scrapeType) {
    // case "scrapeArticles":
    //   await runScrapeArticles();
    //   console.log("FINISHED SCRAPING ARTICLES");
    //   break;

    case "scrapePics":
      await runScrapePics();
      console.log("FINISHED SCRAPING PICS");
      break;
  }
};

//prob put somewhere else
/**
 * Checks if the input data array is empty and provides appropriate response
 * @function checkIfEmpty
 * @param {Object} inputData - The data object to check (containing data from backend)
 * @returns {Object|null} Original data if not empty, formatted message if empty, or null if invalid
 */
export const checkIfEmpty = async (inputData) => {
  //return input if error (add error return here?)!!!
  if (!inputData || !inputData.dataArray) return null;

  //return if data exists
  if (inputData.dataArray.length > 0) return inputData;

  //otherwise return empty obj
  const emptyObj = {
    dataArray: { text: "NO DATA TO DISPLAY, PLEASE RE-SCRAPE KCNA <br> <h2>[Switch re-scrape selection above to YES and run again]</h2>" },
    scrapeType: "empty",
  };

  return emptyObj;
};
