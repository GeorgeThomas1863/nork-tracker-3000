/**
 * @fileoverview Command parsing and execution service for scraping operations
 * @module /src/scrape-parse.js
 *
 * Handles frontend command requests, parses parameters, and executes the appropriate
 * scraping operations for articles, pictures, or both with configurable options.
 */

import CONFIG from "../config/scrape-config.js";

import { scrapeArticlesClick, runScrapeArticles } from "./articles/articles-scrape.js";
import { runPostArticles, postArticlesLoop } from "./articles/articles-post.js";
import { scrapePicsClick, runScrapePics, runGetNewPics } from "./pics/pics-scrape.js";
import { uploadPicsFS } from "./pics/pics-main.js";
import { postComboLoopTG } from "./combo-post.js";
import { startScraper } from "../scraper.js";

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

  //check if empty return
  const emptyData = await checkIfEmpty(data);
  if (emptyData) return res.json(emptyData);

  //check if tg return
  const tgData = await displayTG(data);
  if (tgData) return res.json(tgData);

  //otherwise return data for display
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
  if (pullNewData !== "yesNewData") return null;

  //run get new data based on type
  switch (scrapeType) {
    case "scrapeArticles":
      await runScrapeArticles();
      console.log("FINISHED SCRAPING ARTICLES");
      break;

    case "scrapePics":
      await runGetNewPics();
      console.log("FINISHED SCRAPING PICS");
      break;

    case "scrapeBoth":
      await runScrapeArticles();
      console.log("FINISHED GETTING PICS");
      await runGetNewPics();
      console.log("FINISHED FUCKER");
      break;
  }

  console.log("FINISHED GETTING NEW DATA");
  return true;
};

//--------------
// export const scrapeKCNA = async () => {
//   await runScrapeArticles();
//   await runPostArticles();
//   await runScrapePics();
//   console.log("FINISHED SCRAPE");
// };

export const runRestartAutoScraper = async () => {
  const data = await startScraper();
  console.log(data);

  return true;
};

// Export a function to run once
// export const runOnce = async () => {
//   await scrapeKCNA();
//   return "FINISHED SCRAPE";
// };

// /**
//  * Dynamically the automatic scraper process for pics AND articles
//  * @function runRestartAutoScraper
//  * @returns {Promise<boolean>} True when process completes
//  */
// export const runRestartAutoScraper = async () => {
//   const { runOnce } = await import("./scrape-auto.js");
//   await runOnce();
//   console.log("AHHHHHHHHHHH");

//   return true;
// };

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

//prob put somewhere else
/**
 * Checks if the input data array is empty and provides appropriate response
 * @function checkIfEmpty
 * @param {Object} inputData - The data object to check (containing data from backend)
 * @returns {Object|null} null if not empty; custom emptyObj if empty
 */
export const checkIfEmpty = async (inputData) => {
  //return null if data exists
  if (inputData && inputData.dataArray && inputData.dataArray.length > 0) return null;

  //otherwise return custom empty obj
  const emptyObj = {
    dataArray: { text: "NO DATA TO DISPLAY, PLEASE RE-SCRAPE KCNA <br> <h2>[Switch re-scrape selection above to YES and run again]</h2>" },
    displayType: "empty",
  };

  return emptyObj;
};

//PUT ELSEWHEREs
export const displayTG = async (data) => {
  const { scrapeTo, scrapeType, dataArray, tgId } = data;
  console.log("UPLOADING TO TG");
  console.log(data);

  //return null if not posting to tg
  if (scrapeTo !== "displayTG") return null;

  //otherwise
  let tgData = {};
  switch (scrapeType) {
    case "scrapeArticles":
      const articleObj = {
        articleArray: dataArray,
        postToId: tgId,
      };

      await postArticlesLoop(articleObj);
      tgData.articles = dataArray.length;

      console.log("FINISHED UPLOADING ARTICLES");
      break;

    case "scrapePics":
      //build upload obj
      const picObj = {
        picArray: dataArray,
        postToId: tgId,
      };

      await uploadPicsFS(picObj);
      tgData.pics = dataArray.length;
      break;

    case "scrapeBoth":
      tgData = await postComboLoopTG(data);
      break;
  }

  const returnObj = {
    dataArray: tgData,
    displayType: "tgDisplay",
  };

  console.log("TG RETURN TEST HERE!!");
  console.log(returnObj);

  return returnObj;
};
