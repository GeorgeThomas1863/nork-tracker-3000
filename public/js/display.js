/**
 * @fileoverview Frontend display management utilities
 * @module frontend/display
 *
 * Provides functions for showing/hiding UI elements, handling display updates
 * based on user selections, and rendering data returned from the backend.
 */

import d from "./define-things.js";
import { parseDataReturn } from "./display-return/parse-return.js";

/**
 * Hides an array of DOM elements by adding the 'hidden' class
 * @function hideArray
 * @param {HTMLElement[]} inputs - Array of DOM elements to hide
 * @returns {Promise<void>} Promise that resolves when all elements are hidden
 */
const hideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.add("hidden");
  }
};

/**
 * Unhides / displays an array of DOM elements by removing the 'hidden' class
 * @function unhideArray
 * @param {HTMLElement[]} inputs - Array of DOM elements to show
 * @returns {Promise<void>} Promise that resolves when all elements are shown
 */
const unhideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.remove("hidden");
    // input.classList.remove("#fuck-forms li.hidden");
  }
};

/**
 * Updates display based on which action button was clicked
 * @function runActionButtonDisplay
 * @param {string} buttonClicked - ID of the button that was clicked
 * @returns {Promise<void>} Promise that resolves when display is updated
 */
export const runActionButtonDisplay = async (buttonClicked) => {
  //adult way with switch case
  switch (buttonClicked) {
    case d.scrapeKcnaActionButton.id:
      await unhideArray([d.scraperWrapper]);
      break;

    case d.trackCryptoActionButton.id:
      await hideArray([d.scraperWrapper]);
      break;
  }
};

/**
 * Updates display based on scrape type selection
 * @function runScrapeTypeDisplay
 * @param {string} buttonClicked - Value of the selected scrape type
 * @returns {Promise<void>} Promise that resolves when display is updated
 */
export const runScrapeTypeDisplay = async (buttonClicked) => {
  //hide everything to start
  await hideArray(d.listItemArray);

  //claude's version with select case
  switch (buttonClicked) {
    case d.restartAuto.id:
      await unhideArray([d.tgIdListItem]);
      break;

    case d.scrapeURL.id:
      await unhideArray([d.urlInputListItem, d.scrapeToListItem]);
      break;

    case d.scrapeBoth.id: //both
    case d.scrapePics.id: //pics
    case d.scrapeArticles.id: //articles
      await unhideArray([d.howManyListItem, d.scrapeToListItem, d.pullNewDataListItem]);
      break;
  }

  //figure out if tg chat ID should be hidden
  if (d.scrapeTo.value === displayTG.id) {
    await unhideArray([d.tgIdListItem]);
  }
};

/**
 * Updates display based on scrape to / destination selection
 * @function runScrapeToDisplay
 * @param {string} buttonClicked - Value of the selected scrape destination
 * @returns {Promise<void>} Promise that resolves when display is updated
 */
export const runScrapeToDisplay = async (buttonClicked) => {
  //hide start
  await hideArray([d.tgIdListItem]);

  switch (buttonClicked) {
    case d.displayTG.id: //tgId
      await unhideArray([d.tgIdListItem]);
  }
};

/**
 * Parses / renders returned data from backend to DOM, passes most stuff to return parse functions
 * then unhides the return data display container / element
 * @function displayDataReturn
 * @param {Object} inputData - Data object returned from backend
 * @param {Array} inputData.dataArray - Array of scraped data items
 * @returns {Promise<void>} Promise that resolves when data is displayed
 */
export const displayDataReturn = async (inputData) => {
  //check if data received
  if (!inputData || !inputData.dataArray) return;

  const displayData = await parseDataReturn(inputData);

  //clear previous input
  d.dataReturnElement.innerHTML = "";

  d.dataReturnElement.appendChild(displayData);
  d.dataReturnWrapper.classList.remove("hidden");
  return;
};
