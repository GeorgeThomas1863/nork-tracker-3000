import buildCollapseDisplay from "./collapse-item.js";

//accepts data array, returns array
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

export const getArticleListItem = async (article, isFirst) => {
  const articleListItem = document.createElement("li");
  articleListItem.className = "article-list-item";

  const articleElement = await getArticleElement(article);
  const articleElementCollapse = await buildCollapseDisplay(article.title, articleElement, isFirst);
  articleListItem.append(articleElementCollapse);

  return articleListItem;
};

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
