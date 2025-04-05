/**
 * @fileoverview Responsive file for handling frontend user events (based on user inputs / clicks)
 * @module frontend/event-handlers
 *
 * Sets up event listeners for form submissions and UI element changes,
 * coordinating display updates and API communication based on user actions.
 */

//import modules
import d from "./define-things.js";
import { runActionButtonDisplay, runScrapeTypeDisplay, runScrapeToDisplay, displayDataReturn } from "./display.js";
import { buildInputParams, sendToBack } from "./submit.js";

/**
 * Handles submit event, passing data to backend, then sends to return parser for display
 * @function scrapeSubmit
 * @param {Event} e - The DOM event object
 * @returns {Promise<void>} - Promise that resolves when submission and display are complete
 */
const scrapeSubmit = async (e) => {
  e.preventDefault();

  //get input params
  const inputParams = await buildInputParams();

  //get data
  const data = await sendToBack(inputParams);
  console.dir(data);

  //display data
  await displayDataReturn(data);
};

/**
 * Handles frontend page display changes based on user inputs (drop downs / buttons / selections)
 * @function changeDisplay
 * @param {Event} e - The DOM event object
 * @returns {Promise<void>} - Promise that resolves when display change is complete
 */
const changeDisplay = async (e) => {
  e.preventDefault();
  const eventElement = e.target;
  const buttonClickedId = eventElement.id;
  const buttonClickedValue = eventElement.value;

  //execute function based on event trigger
  switch (eventElement.id) {
    case d.scrapeKcnaActionButton.id:
    case d.trackCryptoActionButton.id:
      await runActionButtonDisplay(buttonClickedId);
      break;

    case d.scrapeType.id:
      await runScrapeTypeDisplay(buttonClickedValue);
      break;

    case d.scrapeTo.id:
      await runScrapeToDisplay(buttonClickedValue);
      break;
  }
};

//action button display
d.scrapeKcnaActionButton.addEventListener("click", changeDisplay);
d.trackCryptoActionButton.addEventListener("click", changeDisplay);

//drop down click listeners
d.scrapeTypeListItem.addEventListener("click", changeDisplay);
d.scrapeToListItem.addEventListener("click", changeDisplay);

//submit event listener
d.submitButton.addEventListener("click", scrapeSubmit);
