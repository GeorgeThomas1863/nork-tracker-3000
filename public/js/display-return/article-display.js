import buildCollapseDisplay from "./collapse-item.js";

/**
 * Builds a ul element containing multiple li elements each of which have parsed article data from data return
 * @function buildArticleList
 * @param {Array<Object>} inputData - Array of article objects
 * @returns {Promise<HTMLElement>} A DOM element containing the list of articles
 */
export const buildArticleList = async (inputData) => {
  const articleListElement = document.createElement("ul");
  articleListElement.className = "article-list";

  let isFirst = true;

  for (const article of inputData) {
    const articleListItem = await getArticleListItem(article, isFirst);
    articleListElement.appendChild(articleListItem);
    isFirst = false;
  }

  return articleListElement;
};

/**
 * Creates a li item containing parsed data for single article, collapsible funcationlity added here
 * @function getArticleListItem
 * @param {Object} article - Article data object
 * @param {boolean} isFirst - Whether this is the first article in the list
 * @returns {Promise<HTMLElement>} A DOM list item element containing the article
 */
export const getArticleListItem = async (article, isFirst) => {
  const articleListItem = document.createElement("li");
  articleListItem.className = "article-list-item";

  const articleElement = await getArticleElement(article);
  const articleElementCollapse = await buildCollapseDisplay(article.title, articleElement, isFirst);
  articleListItem.append(articleElementCollapse);

  return articleListItem;
};

/**
 * Creates an article element by parsing article data (sends result to be added to li)
 * @function getArticleElement
 * @param {Object} article - Article data object
 * @param {string} article.title - The title of the article
 * @param {string} article.date - The date of the article
 * @param {string} article.content - The content of the article
 * @returns {Promise<HTMLElement>} A formatted DOM article element
 */
export const getArticleElement = async (article) => {
  const articleElement = document.createElement("article");
  articleElement.className = "article-element";

  // Create and append title
  const titleElement = document.createElement("h2");
  titleElement.className = "article-title";
  titleElement.textContent = article.title;
  articleElement.appendChild(titleElement);

  // Format and append date
  const dateElement = document.createElement("div");
  dateElement.className = "article-date";

  //date formatting
  const dateObj = new Date(article.date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  articleElement.appendChild(dateElement);

  // Create and append content
  const contentElement = document.createElement("div");
  contentElement.className = "article-content";

  // Fix line breaks by replacing \n with <br> tags
  const contentWithBreaks = article.content.replace(/\n/g, "<br>");

  // Use innerHTML for content since it might contain HTML
  contentElement.innerHTML = contentWithBreaks;
  articleElement.appendChild(contentElement);

  return articleElement;
};
