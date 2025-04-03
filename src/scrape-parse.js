import CONFIG from "../config/scrape-config.js";

import { scrapeArticlesClick, runScrapeArticles } from "./articles/articles-scrape.js";
import { runPostArticles } from "./articles/articles-post.js";
import { scrapePicsClick, runScrapePics } from "./pics/pics-scrape.js";

/**
 * Parses and processes commands from the frontend request
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing command parameters
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with command results
 */
export const parseCommand = async (req, res) => {
  const inputParams = await setInputParamsDefaults(req.body);
  console.log(inputParams);

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

  return res.json(data);
};

//-----------

/**
 * Sets default values for any missing input parameters
 * @param {Object} inputParams - Raw input parameters from request
 * @param {string} [inputParams.scrapeType] - Type of scrape operation
 * @param {string} [inputParams.scrapeTo] - Destination for scraped data
 * @param {string} [inputParams.tgId] - Telegram ID for sending results
 * @param {number} [inputParams.howMany] - Number of items to scrape
 * @param {string} [inputParams.pullNewData] - Whether to pull new data
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
 * Restarts the automatic scraper process for pics AND articles
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

/**
 * Runs a one-time data scraping operation of either pics OR articles OR both
 * @param {Object} inputParams - Input parameters
 * @param {string} inputParams.pullNewData - Whether to pull new data ("yesNewData" or "noNewData")
 * @param {string} inputParams.scrapeType - Type of scrape to perform
 * @returns {Promise<boolean|null>} True when process completes, null if no action taken
 */
export const runGetNewData = async (inputParams) => {
  const { pullNewData, scrapeType } = inputParams;

  //check if get new data on
  if (pullNewData === "noNewData") return null;
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
      await runPostArticles();
      await runScrapePics();
      console.log("FINISHED SCRAPING ARTICLES AND PICS");
      break;
  }

  console.log("FINISHED GETTING NEW DATA");
  return true;
};

//TODO below function
/**
 * Scrapes content from a specific URL (placeholder function)
 * @param {Object} inputParams - Input parameters
 * @returns {Promise<void>}
 */
export const runScrapeURL = async () => {
  console.log("scrapeURL");
};
