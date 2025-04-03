import d from "../define-things.js";

import { buildPicList } from "./pic-display.js";
import { buildArticleList } from "./article-display.js";
import { buildComboList } from "./combo-display.js";

/**
 * Parses returned data from backend and builds appropriate DOM elements by running
 * appropriate function based on data type
 * @function parseDataReturn
 * @param {Object} inputData - The data returned from the backend
 * @param {Array} inputData.dataArray - Array of data items (articles, pictures, or both)
 * @param {string} inputData.dataType - Type of data to determine display method
 * @returns {Promise<HTMLElement>} Container element with the parsed and formatted data
 */
export const parseDataReturn = async (inputData) => {
  const { dataArray, dataType } = inputData;

  //data container for return
  const container = document.createElement("div");
  container.className = "data-container";

  //display based on return data
  switch (dataType) {
    //for pics
    case d.scrapePics.id:
      const picList = await buildPicList(dataArray);
      if (picList && picList.children.length > 0) {
        container.appendChild(picList);
      }
      break;

    //for articles
    case d.scrapeArticles.id:
      const articleList = await buildArticleList(dataArray);
      container.appendChild(articleList);
      break;

    //both / articles
    case d.scrapeBoth.id:
      const comboList = await buildComboList(dataArray);
      container.appendChild(comboList);
      break;
  }

  return container;
};
