/**
 * @fileoverview Frontend API for building scrape req data and sending scrape req to backend
 * @module frontend/api-service
 *
 * Handles building request parameters from user inputs and
 * sending requests to the backend API endpoints.
 */

//import modules
import d from "./define-things.js";

/**
 * Sends the input parameters to the backend API; passes return data back to requesting function for display
 * @function sendToBack
 * @param {Object} inputParams - Parameters object created by buildInputParams
 * @returns {Promise<Object>} Promise resolving to the response data from the server
 * @throws {Error} Logs any errors that occur during the fetch operation
 */
export const sendToBack = async (inputParams) => {
  // console.log(inputParams);
  const route = inputParams.route;
  //send all to backend
  try {
    const res = await fetch(route, {
      method: "POST",
      body: JSON.stringify(inputParams),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Builds parameters for data object from user inputs to send to backend
 * @function buildInputParams
 * @returns {Promise<Object>} Object containing all input parameters
 */
export const buildInputParams = async () => {
  const params = {
    route: "/scrape-submit-route",
    scrapeType: d.scrapeType.value,
    scrapeTo: d.scrapeTo.value,
    urlInput: d.urlInput.value,
    howMany: d.howMany.value,
    tgId: d.tgId.value,
    pullNewData: d.pullNewData.value,
  };
  return params;
};
