/**
 * @fileoverview Frontend data parsing service for backend responses
 * @module frontend/display-return/parse-return
 *
 * Analyzes data returned from the backend and routes it to the appropriate
 * display components based on content type (articles, pictures, or both).
 */

import d from "../define-things.js";

import { buildPicList } from "./display-pic.js";
import { buildArticleList } from "./display-article.js";
import { buildComboList } from "./display-combo.js";
import buildEmptyDisplay from "./display-empty.js";

/**
 * Parses returned data from backend and builds appropriate DOM elements by running
 * appropriate function based on data type
 * @function parseDataReturn
 * @param {Object} inputData - The data returned from the backend
 * @returns {Promise<HTMLElement>} Container element with the parsed and formatted data
 */
export const parseDataReturn = async (inputData) => {
  const { dataArray, scrapeType } = inputData;

  //data container for return
  const container = document.createElement("div");
  container.className = "data-container";

  //display based on return data
  switch (scrapeType) {
    //empty return
    case "empty":
      const emptyData = await buildEmptyDisplay(dataArray);
      container.appendChild(emptyData);
      break;

    //for pics
    case d.scrapePics.id:
      const picList = await buildPicList(dataArray);
      container.appendChild(picList);
      // if (picList && picList.children.length > 0) {
      //   container.appendChild(picList);
      // }
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
