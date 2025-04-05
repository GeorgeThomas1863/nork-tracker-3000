/**
 * @fileoverview Utility functions for picture scraping operations
 * @module services/pics/pics-util
 *
 * Provides helper functions for date calculations, database comparisons,
 * and current ID tracking to support the picture scraping workflow.
 */

import CONFIG from "../../config/scrape-config.js";
import dbModel from "../../models/db-model.js";

/**
 * Gets Pic Array from mongo (for downloading or uploading) based on input param (string); works by
 * comparing collection names
 * @function getPicArray
 * @param {string} type - Type of pic Array to get [options: "picsToDownload" or "picsToUpload"]
 * @returns {Promise<Array<Object>>} Array of pic objects for uploading / downloading
 */
export const getPicArray = async (type) => {
  let params = "";

  if (type !== "picsToDownload" && type !== "picsToUpload") return;

  if (type === "picsToDownload") {
    params = {
      collection1: CONFIG.picCollection, //old thing, to compare against
      collection2: CONFIG.downloadedCollection, //new thing, what this funct is doing
    };
  }

  if (type === "picsToUpload") {
    params = {
      collection1: CONFIG.downloadedCollection,
      collection2: CONFIG.uploadedCollection,
    };
  }

  const picModel = new dbModel(params, "");
  const picArray = await picModel.findNewURLs();
  return picArray;
};

/**
 * Creates an array of date strings (YYYYMM) for current month / year and adjacent months (needed for kcna url format)
 * @function getDateArray
 * @returns {Promise<Array<string>>} Array of date strings (current month and one month before/after)
 */
export const getDateArray = async () => {
  const currentDate = new Date();
  const dateArray = [];

  for (let i = -1; i < 2; i++) {
    const date = new Date(currentDate);
    const currentMonth = date.getMonth();
    //plus 1 needed bc month 0 indexed
    const monthRaw = currentMonth + i + 1;

    // Pad month with leading zero if needed
    const month = monthRaw.toString().padStart(2, "0");

    // Get full year
    const year = date.getFullYear();

    // Add month+year string to result array
    dateArray.push(year + "" + month);
  }

  return dateArray;
};

/**
 * Calculates the current startId for where to look for new pics (+- 200), will default to config start setting
 *if no kcnaId exists in db
 * @function getCurrentKcnaId
 * @returns {Promise<number>} Maximum of either kcnaId value or CONFIG.currentId setting (for startId)
 */
export const getCurrentKcnaId = async () => {
  const dataModel = new dbModel({ keyToLookup: "kcnaId" }, CONFIG.picCollection);
  const maxId = await dataModel.findMaxId();

  //no id on first lookup
  if (!maxId || CONFIG.currentId > maxId) return CONFIG.currentId;

  //otherwise calculate it
  return maxId;
};
