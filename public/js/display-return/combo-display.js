import buildCollapseDisplay from "./collapse-item.js";

import { buildArticlePicList } from "./pic-display.js";
import { getArticleElement } from "./article-display.js";

export const buildComboList = async (inputData) => {
  //define things
  const comboListElement = document.createElement("ul");
  comboListElement.className = "article-list";

  //set first article
  let isFirst = true;
  //loop through each article
  for (const article of inputData) {
    const comboListItem = await getComboListItem(article, isFirst);
    comboListElement.appendChild(comboListItem);
    isFirst = false;
  }

  return comboListElement;
};

export const getComboListItem = async (article, isFirst) => {
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
