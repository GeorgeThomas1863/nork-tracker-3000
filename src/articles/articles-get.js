/**
 * @fileoverview Article fetching and processing service for KCNA content
 * @module services/articles/articles-main
 *
 * Provides functions for retrieving article listings, fetching individual article content,
 * extracting article data, and identifying embedded images within articles.
 */

import { JSDOM } from "jsdom";

import CONFIG from "../../config/scrape-config.js";
import KCNA from "../../models/kcna-model.js";
import dbModel from "../../models/db-model.js";

import { parseArticleHtml } from "./articles-parse.js";

/**
 * GETS HTML of the main page that contains a list of articles
 * @function getArticleListHtml
 * @returns {Promise<string>} HTML content of page with list of articles
 */
export const getArticleListHtml = async () => {
  const articleListObj = {
    url: CONFIG.articleListURL,
    fileName: "articleList.html",
  };

  //get article list
  const articleListModel = new KCNA(articleListObj);
  const articleListHtml = await articleListModel.getHTML();

  return articleListHtml;
};

/**
 * GETS HTML content from a specific article URL
 * @function getArticleHtml
 * @param {string} url - The URL of the article to fetch
 * @returns {Promise<string>} The HTML content of the article
 */
export const getArticleHtml = async (url) => {
  const articleHtmlObj = {
    url: url,
    fileName: "article.html",
  };

  const articleModel = new KCNA(articleHtmlObj);
  const articleHtml = await articleModel.getHTML();

  return articleHtml;
};

//!!!!!!!!!
//SWITCH THIS BACK TO AN ARRAY (double check input first)
//!!!!!

/**
 * Extracts all data from each article into an object, outputs as array of objects
 * @function getArticleObjArray
 * @param {Array<Object>} inputArray - Array of objects containing article URLs (objects are basically just the url)
 * @returns {Promise<Array<Object>>} Array of article objects with content and images
 */
export const getArticleObjArray = async (inputArray) => {
  //return an array
  const articleObjArray = [];
  for (let i = 0; i < inputArray.length; i++) {
    try {
      //check article data isnt already saved
      const inputObj = inputArray[i];
      const dataModel = new dbModel(inputObj, CONFIG.articleContentCollection);
      await dataModel.urlNewCheck(); //will throw error if not new

      //if new get article html
      const article = inputArray[i].url;
      const articleHtml = await getArticleHtml(article);
      // console.log(articleHtml);
      const articleObj = await parseArticleHtml(articleHtml);
      articleObj.url = article; //add url to object
      // articleObj.myId = inputObj.myId; //add myId to article Obj

      //LOOK FOR FUCKING PICS HERE
      if (articleObj && articleObj.picURL) {
        const articlePicArray = await getArticlePicArray(articleObj.picURL);

        //if check prob not necessary
        if (articlePicArray) {
          articleObj.articlePicArray = articlePicArray;
        }
      }

      //add obj to array
      articleObjArray.push(articleObj);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue; //if error move on to next kcna link
    }
  }

  return articleObjArray; //return the ARRAY dumbfuck
};

/**
 * Extracts image URLs (in an object) from kcna pic display page, returns array
 * @function getArticlePicArray
 * @param {string} picURL - URL of the page containing article images
 * @returns {Promise<Array<Object>>} Array of picture objects with URLs and metadata
 */
export const getArticlePicArray = async (picURL) => {
  //get html for link to pics
  const picHtml = await getArticleHtml(picURL);

  const dom = new JSDOM(picHtml);
  const document = dom.window.document;

  const imgElements = document.querySelectorAll("img");
  const articlePicArray = [];

  // Use a for loop to extract the src attributes
  for (let i = 0; i < imgElements.length; i++) {
    try {
      const imgItem = imgElements[i];

      //skip if no image src (some other img on page)
      if (!imgItem || !imgItem.getAttribute("src")) continue;
      const imgSrc = imgItem.getAttribute("src");

      //extract out kcnaId for file name
      const picPathNum = imgSrc.substring(imgSrc.length - 11, imgSrc.length - 4);
      if (!picPathNum) continue;
      const kcnaId = String(Number(picPathNum));
      //extract out stupid date string
      const dateString = imgSrc.substring(imgSrc.indexOf("/photo/") + "/photo/".length, imgSrc.indexOf("/PIC", imgSrc.indexOf("/photo/")));

      const picObj = {
        url: "http://www.kcna.kp" + imgSrc,
        picPath: CONFIG.savePicPathBase + kcnaId + ".jpg",
        kcnaId: +kcnaId,
        dateString: dateString,
      };
      if (!picObj) continue;

      //push all to array
      articlePicArray.push(picObj);

      //store pics if any new for LATER downloading
      const dataModel = new dbModel(picObj, CONFIG.picCollection);
      const storePicData = await dataModel.storeUniqueURL();
      console.log(storePicData);
    } catch (e) {
      console.log(e.message + "; URL: " + e.url + "; BREAK: " + e.function);
    }
  }

  return articlePicArray;
};
