/**
 * @fileoverview Article scraping controller for UI interactions and automated processes
 * @module src/articles/articles-scrape.js
 *
 * Coordinates the full article scraping process including fetching article listings,
 * downloading content, sorting articles, and preparing data for UI display.
 */

import dbModel from "../../models/db-model.js";
import CONFIG from "../../config/scrape-config.js";

import { getArticleListHtml, getArticleObjArray } from "./articles-get.js";
import { parseArticleList, sortArticleObjArray } from "./articles-parse.js";
import { logArticleLookup, storeArticleList, storeArticleObj } from "./articles-store.js";
import { getArticleArray } from "./articles-util.js";

/**
 * API endpoint handler for scraping articles based on CLICK from UI
 * @function scrapeArticlesClick
 * @param {Object} inputParams - Data Object with input params from the UI
 * @returns {Promise<Object|Array>} Article data or status object
 */
export const scrapeArticlesClick = async (inputParams) => {
  const { scrapeType, howMany, scrapeTo, tgId, pullNewData } = inputParams;

  //if set to new run scrape articles
  if (pullNewData === "yesNewData") {
    await runScrapeArticles();
  }

  //get article data from mongo
  const modelObj = {
    keyToLookup: "myId",
    howMany: howMany,
  };

  const dataModel = new dbModel(modelObj, CONFIG.articleContentCollection);
  const articleDataArray = await dataModel.getLastItemsArray();

  console.log("ARTICLE DATA ARRAY!!!!!!!");
  console.log(articleDataArray);
  console.log(articleDataArray.length);

  //if empty //UNFUCK
  if (articleDataArray.length === 0) {
    articleDataArray.empty = "YES";
    // console.log(articleDataArray);
    return articleDataArray;
  }

  const returnObj = {
    dataArray: articleDataArray,
    dataType: scrapeType,
  };

  //otherwise return obj and process on frontend
  return returnObj;
};

/**
 * Runs Full ARTICLE scrape process (scraping article content from kcna)
 * @function runScrapeArticles
 * @returns {Promise<Array|null>} Array of article objects or null if no new articles
 */
export const runScrapeArticles = async () => {
  //get the articles currently on site
  const articleListHtml = await getArticleListHtml();

  //log lookups can turn fof
  await logArticleLookup(articleListHtml);

  //parse out an array of articles
  const articleListArray = await parseArticleList(articleListHtml);
  console.log("ARTICLE LIST ARRAY");
  console.log(articleListArray);

  //otherwise store articles and get article data
  const storeArticleListArray = await storeArticleList(articleListArray);
  console.log(storeArticleListArray);

  //check if new articles to download / parse
  const downloadArticleArray = await getArticleArray("articlesToDownload");

  //get data for each article by looping through array, return for tracking
  const articleObjArray = await getArticleObjArray(downloadArticleArray);

  //sort array and add in my id here
  const articleObjArrayNormal = await sortArticleObjArray(articleObjArray);

  if (!articleObjArrayNormal || articleObjArrayNormal.length === 0) {
    console.log("NO NEW ARTICLES");
    return null;
  }

  //then loop through and store each item
  const storeArticleObjArray = await storeArticleObj(articleObjArrayNormal);
  console.log(storeArticleObjArray);

  //PUT CHECK HERE TO UPLOAD TO TG

  console.log("FINISHED GETTING NEW ARTICLES");

  return articleObjArrayNormal;
};
