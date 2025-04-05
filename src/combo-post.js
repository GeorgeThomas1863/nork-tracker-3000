/**
 * @fileoverview Posts combined pics / articles to tg (scrapeType: "scrapeBoth")
 * @module src/combo-post.js
 *
 * Provides functions for posting both articles and their associated pictures
 * to Telegram in a coordinated process.
 */

import { uploadPicsFS } from "./pics/pics-main.js";
import { postArticlesLoop } from "./articles/articles-post.js";

/**
 * Processes and posts an array of articles with their associated pictures to TG (loops through array)
 * @function postComboLoop
 * @param {Object} inputData - Object containing article data array and tg channel to post to
 * @returns {Promise<Object>} Object containing count of pictures and articles posted
 */
export const postComboLoop = async (inputData) => {
  const { dataArray, tgId } = inputData;

  let x = 0; //# pics posted
  let y = 0; //# articles posetd
  for (const article of dataArray) {
    //skip empty items
    if (!article || article.length === 0) continue;
    article.tgId = tgId;

    //check if article has pics, post them if so, return # posted
    const picsPosted = await postComboPics(article);
    x = x + picsPosted;
    //post article
    await postComboArticle(article);
    y++;
  }

  //return how much shit was posted
  const postedObj = {
    pics: x,
    articles: y,
  };

  return postedObj;
};

/**
 * Posts a specifice article's pics to TG (done first)
 * @function postComboPics
 * @param {Object} articleData - Article data object with pic urls
 * @returns {Promise<number|null>} Number of pictures posted, or null if no pictures
 */
const postComboPics = async (articleData) => {
  const { articlePicArray, tgId } = articleData;

  //if no pics return
  if (!articlePicArray || articlePicArray.length === 0) return null;

  //otherwise build pic uploadObj
  const picObj = {
    picArray: articlePicArray,
    postToId: tgId,
  };

  //post pic
  await uploadPicsFS(picObj);

  return articlePicArray.length;
};

/**
 * Posts a single article to TG
 * @function postComboArticle
 * @param {Object} articleData - Article data object
 * @returns {Promise<boolean>} True when the article has been posted
 */
const postComboArticle = async (articleData) => {
  const articleObj = {
    articleArray: [articleData], //single array item, hopefully works
    postToId: articleData.tgId,
  };

  await postArticlesLoop(articleObj);
  return true;
};
