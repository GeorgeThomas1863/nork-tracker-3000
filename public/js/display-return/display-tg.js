/**
 * @fileoverview Telegram upload success display
 * @module frontend/display-return/tg-display.js
 *
 * Provides a function for creating a DOM element to display the status
 * of content uploaded to Telegram, showing counts of posted items.
 */

/**
 * Creates a DOM element to display Telegram upload success message with item counts
 * @function buildTGDisplay
 * @param {Object} inputData - Object containing counts of posted items
 * @returns {Promise<HTMLElement>} A DOM element containing the formatted upload status message
 */
const buildTGDisplay = async (inputData) => {
  //example of desctructuring with default values (thnaks claude)
  const { pics = 0, articles = 0 } = inputData;

  const tgContainer = document.createElement("ul");
  const tgElement = document.createElement("li");

  //stealing style of empty container, can add others here if needed
  tgContainer.className = "empty-container";
  tgElement.className = "empty-text";

  const displayText = `Data successfully uploaded to Telegram. <br><h2>${pics} Pics and ${articles} Articles posted.</h2>`;

  tgElement.innerHTML = displayText;
  tgContainer.append(tgElement);

  return tgContainer;
};

export default buildTGDisplay;
