/**
 * @fileoverview Empty state display component builder
 * @module frontend/display-return/empty-display.js
 *
 * Provides a function for creating a DOM element to display a message
 * when no data is available for presentation to the user.
 */

/**
 * Creates a DOM element to display when no data is available
 * @function buildEmptyDisplay
 * @param {Object} inputData - Object containing the empty state message
 * @returns {Promise<HTMLElement>} A DOM element containing the formatted empty state message
 */
const buildEmptyDisplay = async (inputData) => {
  const emptyContainer = document.createElement("ul");
  const emptyElement = document.createElement("li");

  emptyContainer.className = "empty-container";
  emptyElement.className = "empty-text";

  emptyElement.innerHTML = inputData.text;
  emptyContainer.append(emptyElement);

  return emptyContainer;
};

export default buildEmptyDisplay;
