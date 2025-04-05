/**
 * @fileoverview Combined article and picture display component (for displaying BOTH articles AND pics)
 * @module frontend/display-return/combo-display
 *
 * Provides functions for creating DOM elements that display both article content
 * and associated pictures in a collapsible, structured format.
 */

import buildCollapseDisplay from "./collapse-item.js";
import { buildArticlePicList } from "./display-pic.js";
import { getArticleElement } from "./display-article.js";

/**
 * Creates an ul element by building array of li elements with combined article AND picture elements
 * @function buildComboList
 * @param {Array<Object>} inputData - Array of article objects with pictures
 * @returns {Promise<HTMLElement>} A DOM element containing the list of articles with pictures
 */
export const buildComboList = async (inputData) => {
  //define things
  const comboListElement = document.createElement("ul");
  comboListElement.className = "article-list";

  //set first article
  let isFirst = true;
  //loop through each article
  for (const article of inputData) {
    const comboListItem = await buildComboListItem(article, isFirst);
    comboListElement.appendChild(comboListItem);
    isFirst = false;
  }

  return comboListElement;
};

/**
 * Creates li element containing combo article AND pic data
 * @function buildComboListItem
 * @param {Object} article - Article data object with pictures
 * @param {boolean} isFirst - Whether this is the first article in the list
 * @returns {Promise<HTMLElement>} A DOM list item containing article content and pictures
 */
export const buildComboListItem = async (article, isFirst) => {
  const comboListItem = document.createElement("li");
  comboListItem.className = "article-list-item";

  const articlePicContainer = document.createElement("div");
  articlePicContainer.className = "article-pic-container";

  //add pic data if it exists
  const articlePicList = await buildArticlePicList(article);
  if (articlePicList && articlePicList.children && articlePicList.children.length > 0) {
    //make it collapsible
    const articlePicListCollapse = await buildCollapseDisplay(articlePicList.children.length + " PICS", articlePicList, false);
    articlePicListCollapse.className = "article-pic-list-collapse";
    articlePicContainer.append(articlePicListCollapse);
  }

  //next get the article data and add it
  const articleElement = await getArticleElement(article);
  articlePicContainer.appendChild(articleElement);
  const articlePicsItemCollapse = await buildCollapseDisplay(article.title, articlePicContainer, isFirst);
  comboListItem.appendChild(articlePicsItemCollapse);

  return comboListItem;
};
