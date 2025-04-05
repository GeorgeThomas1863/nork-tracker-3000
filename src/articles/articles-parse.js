/**
 * @fileoverview Article HTML parsing and data extraction service
 * @module services/articles/articles-parse
 *
 * Provides functions for parsing HTML content from KCNA pages, extracting article listings,
 * parsing individual article content, and organizing articles with sequential IDs.
 */

import { JSDOM } from "jsdom";

import CONFIG from "../../config/scrape-config.js";
import dbModel from "../../models/db-model.js";

import { getMyId } from "./articles-util.js";

/**
 * Parses the main page HTML to extract a list of article URLs
 * @function parseArticleList
 * @param {string} inputData - HTML content of the main page
 * @returns {Promise<Array<Object>>} Array of objects containing article URLs
 */
export const parseArticleList = async (inputData) => {
  const articleListArray = [];
  // Parse the HTML using JSDOM
  const dom = new JSDOM(inputData);
  const document = dom.window.document;

  // Find the element with class "article-link"
  const articleLinkElement = document.querySelector(".article-link");

  // If the element doesn't exist, return an empty array
  if (!articleLinkElement) {
    console.log('No element with class "article-link" found.');
    return [];
  }

  // Find all anchor tags within the article-link element
  const linkElements = articleLinkElement.querySelectorAll("a");
  const urlConstant = "http://www.kcna.kp";

  // Use a for loop to extract the href values
  for (let i = 0; i < linkElements.length; i++) {
    const href = linkElements[i].getAttribute("href");

    //check if new (prob NOT necessary here)
    try {
      const urlObj = {}; //reset obj
      urlObj.url = urlConstant + href;

      const dataModel = new dbModel(urlObj, CONFIG.articleListCollection);
      await dataModel.urlNewCheck(); //will throw error if not unique

      //otherwise add to array
      articleListArray.push(urlObj);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue; //if error move on to next link
    }
  }

  return articleListArray;
};

/**
 * Parses the HTML content of a SINGLE article to extract its data
 * @function parseArticleHtml
 * @param {string} inputHtml - HTML content of the article page
 * @returns {Promise<Object>} Article object with title, date, content and picture URL
 * @throws {Error} Throws an error if date parsing fails
 */
export const parseArticleHtml = async (inputHtml) => {
  const dom = new JSDOM(inputHtml);
  const document = dom.window.document;

  // Extract the title - KCNA uses article-main-title class
  const titleElement = document.querySelector(".article-main-title");
  const articleTitle = titleElement.textContent.replace(/\s+/g, " ").trim();

  //extract date
  const dateElement = document.querySelector(".publish-time");
  const dateRaw = dateElement.textContent.replace('www.kcna.kp ', '').replace(/[\(\)]/g, '').trim(); //prettier-ignore
  const year = parseInt(dateRaw.substring(0, 4));
  const month = parseInt(dateRaw.substring(5, 7));
  const day = parseInt(dateRaw.substring(8, 10));

  // Validate the date
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    const error = new Error("DATE FUCKED");
    error.url = articleTitle; //dont care
    error.function = "parseArticleHTML";
    throw error;
  }

  // Create a new Date object (month is 0-indexed in JavaScript)
  const articleDate = new Date(year, month - 1, day);

  //get article pics (if they exist)
  const mediaIconElement = document.querySelector(".media-icon");
  const hrefURL = mediaIconElement.firstElementChild.getAttribute("href");
  const picURL = "http://www.kcna.kp" + hrefURL;
  // http://www.kcna.kp/kp/media/photo/q/73388570c8a3bebb35f5b1b0dd7b1b30f4e58af2309ca4619e2b99da172d90b5.kcmsf

  //get article content
  let articleContent = "";
  const contentElement = document.querySelector(".content-wrapper");
  const paragraphs = contentElement.querySelectorAll("p");

  // Use a traditional for loop instead of map
  let paragraphArray = [];
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphArray.push(paragraphs[i].textContent.trim());
  }

  // Join paragraphs with double newlines for better readability
  articleContent = paragraphArray.join("\n\n");

  const articleObj = {
    title: articleTitle,
    date: articleDate,
    content: articleContent,
    picURL: picURL,
  };

  return articleObj;
};

/**
 * Sorts an array of article objects by date AND assigns sequential IDs
 * @function sortArticleObjArray
 * @param {Array<Object>} inputArray - Array of article objects to sort
 * @returns {Promise<Array<Object>|null>} Sorted array with myId properties added, or null if input is empty
 */
export const sortArticleObjArray = async (inputArray) => {
  //return on blank input
  if (inputArray.length === 0) return null;
  const arrayNormal = [];

  //sort input array
  inputArray.sort((a, b) => {
    // Convert datetime strings to Date objects if needed
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare dates (ascending order - oldest to newest)
    return dateA - dateB;
  });

  //get the current myId, returns 0 if doesnt exist
  const myIdCurrent = await getMyId(0);

  // Add numeric identifier using a for loop
  for (let i = 0; i < inputArray.length; i++) {
    const newObj = { ...inputArray[i] };

    // Add the numeric identifier
    newObj.myId = i + myIdCurrent;
    console.log("AHHHHHHHHHHHH");
    console.log(i + myIdCurrent);

    // Add to the output array
    arrayNormal.push(newObj);
  }

  return arrayNormal;
};
