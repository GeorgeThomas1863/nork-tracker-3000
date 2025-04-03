import dbModel from "../../models/db-model.js";
import CONFIG from "../../config/scrape-config.js";
import { sendMessageChunkTG } from "../tg-api.js";

/**
 * default post handler
 * @param {string} postToId - The ID of the channel to post to (defaults to CONFIG.articleSendToId)
 * @returns {Promise<number|null>} The number of articles posted, or null if no articles were posted
 */
export const runPostArticles = async (postToId = CONFIG.articleSendToId) => {
  //check if any new articles
  const articleObj = {
    collection1: CONFIG.articleContentCollection,
    collection2: CONFIG.articlePostedCollection,
  };

  const articleModel = new dbModel(articleObj, "");
  const articleArray = await articleModel.findNewURLs();

  console.log("NOW POSTING NEW ARTICLES. NEW ARTICLE LIST:");
  console.log(articleArray);

  // console.log(articleArray);
  if (articleArray.length === 0) return null; //no new articles to post

  //sort the article array //UNSURE IF WORKS
  articleArray.sort((a, b) => a.myId - b.myId);

  //loop through ARTICLE array
  for (let i = 0; i < articleArray.length; i++) {
    try {
      //normalize data and post
      const articleObj = articleArray[i];
      const normalObj = await normalizeInputsTG(articleObj);

      //add post to to object
      normalObj.postToId = postToId;
      const sendMessageData = await handleSendMessage(normalObj);
      // console.log(sendMessageData);

      //store original object, not normalized data
      const storeModel = new dbModel(articleObj, CONFIG.articlePostedCollection);
      await storeModel.storeUniqueURL();
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue;
    }
  }

  console.log("FINISHED POSTING " + articleArray.length + " NEW ARTICLES");
  return articleArray.length;
};

/**
 * Normalizes article data for telegram posting format
 * @param {Object} inputObj - The article object to normalize
 * @param {string} inputObj.url - The article URL
 * @param {Date} inputObj.date - The article date
 * @param {string} inputObj.title - The article title
 * @param {string} inputObj.content - The article content
 * @returns {Promise<Object>} Normalized object with telegram-friendly formatting
 */
export const normalizeInputsTG = async (inputObj) => {
  const urlRaw = inputObj.url;
  const urlNormal = urlRaw.replace(/\./g, "[.]").replace(/:/g, "[:]");
  const dateRaw = inputObj.date;
  const dateNormal = new Date(dateRaw).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const titleNormal = `<b>${inputObj.title}</b>`;

  const outputObj = {
    url: urlNormal,
    date: dateNormal,
    title: titleNormal,
    content: inputObj.content,
  };

  return outputObj;
};

/**
 * Handles sending messages to Telegram, splitting content into chunks if too long
 * @param {Object} inputObj - Object containing message data
 * @param {string} inputObj.url - The article URL
 * @param {string} inputObj.date - The formatted article date
 * @param {string} inputObj.title - The article title with HTML formatting
 * @param {string} inputObj.content - The article content
 * @param {string} inputObj.postToId - The Telegram channel ID to post to
 * @returns {Promise<number>} The length of the content sent
 */
//chunk content logic if too long
export const handleSendMessage = async (inputObj) => {
  const { url, date, title, content, postToId } = inputObj; //destructure everything
  const maxLength = CONFIG.tgMaxLength - title.length - date.length - url.length - 100;
  const chunkTotal = Math.ceil(content.length / maxLength);
  let chunkCount = 0;

  //set  base params
  const params = {
    chat_id: postToId,
    parse_mode: "HTML",
  };

  //if short enough send normally
  if (content.length < maxLength) {
    params.text = title + "\n" + date + "\n\n" + content + "\n\n" + url;
    await sendMessageChunkTG(params);
    return content.length;
  }

  //otherwise send in chunks
  for (let i = 0; i < content.length; i += maxLength) {
    chunkCount++;
    const chunk = content.substring(i, i + maxLength);
    //if first message
    if (chunkCount === 1) {
      params.text = title + "\n" + date + "\n\n" + chunk;
      await sendMessageChunkTG(params);
      continue;
    }

    //if last messagse
    if (chunkCount === chunkTotal) {
      params.text = chunk + "\n\n" + url;
      await sendMessageChunkTG(params);
      continue;
    }

    //otherwise send just chunk
    params.text = chunk;
    await sendMessageChunkTG(params);
  }

  return content.length;
};
