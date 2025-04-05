/**
 * @fileoverview Picture scraping controller for UI interactions and automated processes
 * @module services/pics/pics-scrape
 *
 * Handles UI-triggered picture scraping operations and automated scraping processes,
 * coordinating the finding, downloading, and uploading of pictures to Telegram.
 */

import dbModel from "../../models/db-model.js";
import CONFIG from "../../config/scrape-config.js";

import { getPicURLs, downloadPicsFS, uploadPicsFS } from "./pics-main.js";
import { getPicArray } from "./pics-util.js";

/**
 * API endpoint handler for scraping PICS based on CLICK from UI
 * @function scrapePicsClick
 * @param {Object} inputParams - User input params from the UI
 * @returns {Promise<Object|Array>} Picture data or status object
 */
export const scrapePicsClick = async (inputParams) => {
  const { scrapeType, howMany, scrapeTo, tgId, pullNewData } = inputParams;

  //if user selects new data
  if (pullNewData === "yesNewData") {
    await runScrapePics();
  }

  const modelObj = {
    keyToLookup: "kcnaId",
    howMany: howMany,
  };

  const dataModel = new dbModel(modelObj, CONFIG.downloadedCollection);
  const picDataArray = await dataModel.getLastItemsArray();

  console.log("AHHHHHHHHH");
  console.log(picDataArray);

  //SHOULD RENAME COMBINE WITH BELOW
  const returnObj = {
    dataArray: picDataArray,
    dataType: scrapeType,
  };

  const uploadObj = {
    picArray: picDataArray,
    postToId: tgId, //defaults to same as config
  };

  //add check for sending to tg
  // if (scrapeTo === "displayTG") {
  //   //send anything new to tg
  //   const tgData = await uploadPicsFS(uploadObj);
  //   // console.log(tgData);
  //   return { data: "DATA POSTED TO TG" };
  // }

  //if empty //UNFUCK
  if (picDataArray.length === 0) {
    picDataArray.empty = "YES";
    return picDataArray;
  }

  //otherwise return obj
  return returnObj;
};

/**
 * Runs full PIC scrape process - finds new pictures, downloads them, and uploads them to Telegram
 * DOES ALL 3: looks for, downloads, AND uploading new pics; if ANY new in ANY of 3 will handle
 * @function runScrapePics
 * @returns {Promise<Array<Object>>} Array of new picture objects that were found
 */
export const runScrapePics = async () => {
  console.log("ON DOWNLOADING NEW PICS");

  const newPicUrls = await getPicURLs();
  console.log("LIST OF NEW PICS");
  console.log(newPicUrls);

  //GET PIC ARRAY for downloading here (specifying type in arg)
  const downloadPicArray = await getPicArray("picsToDownload");
  console.log("!!!!!PIC ARRAY!!!!!");
  console.log(downloadPicArray);

  //run download pics
  await downloadPicsFS(downloadPicArray);

  console.log("FINISHED DOWNLOADING, NOW UPLOADING");

  //get pic array for uploading here
  const uploadPicArray = await getPicArray("picsToUpload");

  console.log("UPLOAD PIC ARRAY");

  //build upload obj
  const uploadObj = {
    picArray: uploadPicArray,
    postToId: CONFIG.articleSendToId,
  };

  console.log(uploadObj);

  //run upload pics
  await uploadPicsFS(uploadObj);

  //PUT CHECK HERE TO UPLOAD TO TG

  console.log("FINISHED UPLOADING PICS");

  return newPicUrls;
};
