/**
 * @fileoverview KCNA picture fetching, downloading, and uploading service
 * @module services/pics/pics-service
 *
 * Provides functions for finding new picture URLs, downloading images to the filesystem,
 * and uploading them to Telegram with appropriate metadata and captions.
 */

import CONFIG from "../../config/scrape-config.js";
import KCNA from "../../models/kcna-model.js";
import dbModel from "../../models/db-model.js";

import { getDateArray, getCurrentKcnaId } from "./pics-util.js";
import { uploadPicsTG, editCaptionTG } from "../tg-api.js";

/**
 * LOOKS FOR / Gets new picture URLs within a range around the current KCNA ID
 * @function getPicURLs
 * @returns {Promise<Array<Object>>} Array of new picture objects with URLs and metadata
 */
export const getPicURLs = async () => {
  const newPicArray = [];

  //get date array
  const dateArray = await getDateArray();
  const currentKcnaId = await getCurrentKcnaId();

  console.log("HERE CURRENT KCNA ID");
  console.log(currentKcnaId);

  //loop 200 (400 lookups an hour)
  const startId = currentKcnaId - 100;
  const stopId = currentKcnaId + 100;

  let arrayIndex = 0;

  //loop
  for (let i = startId; i <= stopId; i++) {
    // console.log(i);
    for (let k = 0; k < dateArray.length; k++) {
      try {
        const dateString = dateArray[arrayIndex];
        const url = CONFIG.picBaseURL + dateString + "/PIC00" + i + ".jpg";
        console.log(url);

        const urlObj = {
          url: url,
        };

        //check if already have url BEFORE http req
        const checkModel = new dbModel(urlObj, CONFIG.picCollection);
        await checkModel.urlNewCheck(); //will throw error if not new

        //http req
        const kcnaModel = new KCNA(urlObj);
        const dataType = await kcnaModel.getDataType();

        //if not pic move on
        if (dataType !== "image/jpeg") {
          arrayIndex++;
          if (arrayIndex > 2) arrayIndex = 0; //reset array, CHANGE number
          continue;
        }

        //build pic path HERE
        //store it
        const picPath = CONFIG.savePicPathBase + i + ".jpg";
        const storeParams = {
          url: url,
          kcnaId: i,
          dateString: dateString,
          picPath: picPath,
        };

        const dataModel = new dbModel(storeParams, CONFIG.picCollection);
        await dataModel.storeUniqueURL();

        //if successfully stored (and therefore is unique) add to array for tracking
        newPicArray.push(storeParams);
        break;
      } catch (e) {
        console.log(e.message + "; URL: " + e.url + "; BREAK: " + e.function);
        break;
      }
    }
  }
  return newPicArray;
};


/**
 * Downloads pics from URLs to the file system
 * @function downloadPicsFS
 * @param {Array<Object>} picArray - Array of picture objects to download
 * @returns {Promise<boolean>} - returns true if successful / when downloading finished
 */
export const downloadPicsFS = async (picArray) => {
  //loop
  for (let i = 0; i < picArray.length; i++) {
    try {
      const pic = picArray[i];

      //add check HERE if pic has already been downloaded
      const storePicModel = new dbModel(pic, CONFIG.downloadedCollection);
      await storePicModel.urlNewCheck(); //throws error if pic already downloaded

      //otherwise build params to download
      const downloadPicParams = {
        url: pic.url,
        savePath: pic.picPath,
      };

      console.log(downloadPicParams);

      //download pic
      const downloadPicModel = new KCNA(downloadPicParams);
      const downloadPicData = await downloadPicModel.downloadPicFS();
      console.log(downloadPicData);

      //store pic was downloaded
      const storePicDownloaded = await storePicModel.storeUniqueURL();
      console.log(storePicDownloaded);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }

  return true;
};



/**
 * Uploads pictures to Telegram from the file system
 * @function uploadPicsFS
 * @param {Object} uploadObj - Object containing upload parameterss
 * @returns {Promise<boolean>} Returns true when uploading is complete
 */
export const uploadPicsFS = async (uploadObj) => {
  const { picArray, postToId } = uploadObj;
  console.log("HERE");
  console.log(uploadObj);

  //sort the array //UNSURE IF WORKS
  picArray.sort((a, b) => a.kcnaId - b.kcnaId);

  console.log("!!!!!! UPLOAD PIC ARRAY AFTER SORT");
  console.log(picArray);

  for (let i = 0; i < picArray.length; i++) {
    try {
      const pic = picArray[i];

      //add check if pic is already uploaded
      const storePicModel = new dbModel(pic, CONFIG.uploadedCollection);

      //REMOVING FOR SITE, FIND PLACE TO CHECK THIS EARLIER IN AUTO !!!
      // await storePicModel.urlNewCheck(); //throws error if pic already uploaded

      //otherwise build params and download
      const params = {
        chatId: postToId,
        picPath: pic.picPath,
      };

      console.log(params);

      //upload pic
      const uploadPicData = await uploadPicsTG(params);
      // console.log(uploadPicData)

      //edit caption
      const defangURL = pic.url.replace(/\./g, "[.]").replace(/:/g, "[:]");
      const normalURL = defangURL.substring(15);
      const caption = "ID: " + pic.kcnaId + "; URL: " + normalURL;
      await editCaptionTG(uploadPicData, caption);
      // console.log(editCaptionData);

      //store pic was uploaded
      const storePicDownloaded = await storePicModel.storeUniqueURL();
      console.log(storePicDownloaded);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }
  return true;
};
