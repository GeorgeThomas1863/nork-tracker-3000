/**
 * @fileoverview Article database storage service
 * @module services/articles/articles-store
 *
 * Provides functions for storing article listings, article content objects,
 * and logging article lookup attempts in the database.
 */

import CONFIG from "../../config/scrape-config.js";
import dbModel from "../../models/db-model.js";

//!!!!TO DO:
//COMBINE BELOW INTO SINGLE FUNCTION
//!!!!!!!

/**
 * Stores a list of article URLs in the database
 * @function storeArticleList
 * @param {Array<Object>} inputArray - Array of objects containing article URLs
 * @returns {Promise<boolean>} True if storage was successful
 */
export const storeArticleList = async (inputArray) => {
  for (let i = 0; i < inputArray.length; i++) {
    //should all be unique, no need for try catch
    const urlObj = inputArray[i];
    const storeModel = new dbModel(urlObj, CONFIG.articleListCollection);
    const storeURL = await storeModel.storeUniqueURL();
    // console.log(storeURL);
  }
  return true;
};

/**
 * Stores detailed article objects from single article
 * @function storeArticleObj
 * @param {Array<Object>} inputArray - Array of article objects with content
 * @returns {Promise<boolean>} True if storage was successful
 */
export const storeArticleObj = async (inputArray) => {
  //loop through and store each item
  for (let i = 0; i < inputArray.length; i++) {
    try {
      const urlObj = inputArray[i];
      const storeModel = new dbModel(urlObj, CONFIG.articleContentCollection);
      const storeData = await storeModel.storeUniqueURL();
      console.log(storeData);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }

  return true;
};

//!!! MAYBE MOVE TO UTIL
/**
 * Logs article lookup attempts for debugging/tracking
 * @function logArticleLookup
 * @param {string} articleListHtml - HTML content of the article list page
 * @returns {Promise<void>}
 */
export const logArticleLookup = async (articleListHtml) => {
  //pull first 50 characters just to ensure working
  const sampleHtml = articleListHtml.trim().substring(50, 200);
  const dateTime = new Date().toISOString();

  //store params
  const params = {
    html: sampleHtml,
    dateTime: dateTime,
  };

  //store data
  const storeModel = new dbModel(params, CONFIG.articleLogCollection);
  await storeModel.storeAny();
};
