//import modules
import d from "./define-things.js";

/**
 * Sends the input parameters to the backend API; passes return data back to requesting function for display
 * @function sendToBack
 * @param {Object} inputParams - Parameters object created by buildInputParams
 * @param {string} inputParams.route - API endpoint to send data to
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
 * @property {string} route - API endpoint for scrape submission
 * @property {string} scrapeType - Type of scraping operation to perform
 * @property {string} scrapeTo - Destination for scraped data
 * @property {string} urlInput - URL to scrape data from
 * @property {string|number} howMany - Quantity of items to scrape
 * @property {string} tgId - Target group identifier
 * @property {boolean|string} pullNewData - Flag to indicate if fresh data should be retrieved
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
