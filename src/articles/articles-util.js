/**
 * @fileoverview Utility functions for article operations
 * @module services/articles/articles-util
 *
 * Provides helper functions for comparing article collections
 * and managing article ID sequences.
 */

import CONFIG from "../../config/scrape-config.js";
import dbModel from "../../models/db-model.js";

/**
 * Retrieves arrays of articles based on the specified type
 * @function getArticleArray
 * @param {string} type - Type of articles to get ("articlesToDownload" or "articlesToUpload")
 * @returns {Promise<Array>} Array of article objects
 */
export const getArticleArray = async (type) => {
  let params = "";

  if (type !== "articlesToDownload" && type !== "articlesToUpload") return;

  if (type === "articlesToDownload") {
    params = {
      collection1: CONFIG.articleListCollection, //old thing, to compare against
      collection2: CONFIG.articleContentCollection, //new thing, what this funct is doing
    };
  }

  if (type === "articlesToUpload") {
    params = {
      collection1: CONFIG.articleContentCollection,
      collection2: CONFIG.articlePostedCollection,
    };
  }

  const articleModel = new dbModel(params, "");
  const articleArray = await articleModel.findNewURLs();
  return articleArray;
};

/**
 * Gets the current maximum myId value or uses the provided input (for when collection is blank)
 * @function getMyId
 * @param {number} inputId - Default ID to use if no higher ID is found
 * @returns {Promise<number>} The highest myId value
 */
export const getMyId = async (inputId) => {
  const dataModel = new dbModel({ keyToLookup: "myId" }, CONFIG.articleContentCollection);
  const myIdStored = dataModel.findMaxId();

  //if doesnt exists
  if (!myIdStored || inputId > myIdStored) return inputId;

  //return current stored id (add 1 later)
  if (myIdStored > inputId) {
    return myIdStored;
  }

  //if equal just return input
  return inputId;
};
