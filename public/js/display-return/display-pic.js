/**
 * @fileoverview Picture display component builder for frontend PIC rendering
 * @module frontend/display-return/pic-display
 *
 * Provides functions for creating DOM elements to display pictures,
 * both as standalone picture lists and as picture lists associated with articles.
 */

/**
 * Builds ul element containing li array of pictures posteed WITH each article (if any exist)
 * @function buildArticlePicList
 * @param {Object} inputData - Article data object
 * @returns {Promise<HTMLElement|null>} A DOM element containing the picture list or null if no pictures
 */
export const buildArticlePicList = async (inputData) => {
  console.log("FUCK YOU FAGGOT");
  console.log(inputData);
  //check if no pics
  if (!inputData || !inputData.articlePicArray || inputData.articlePicArray.length === 0) return null;

  //otherwise do same as below
  const picList = document.createElement("ul");
  picList.className = "pic-list";

  for (const pic of inputData.articlePicArray) {
    const picListItem = await getPicListItem(pic);
    picList.appendChild(picListItem);
  }

  return picList;
};

/**
 * Builds ul element by creating and appending li array of pics; for STANDALONE pic display (not with articles)
 * @function buildPicList
 * @param {Array<Object>} inputData - Array of picture objects
 * @returns {Promise<HTMLElement>} A DOM element containing the picture list
 */
export const buildPicList = async (inputData) => {
  const picList = document.createElement("ul");
  picList.className = "pic-list";

  for (const pic of inputData) {
    const picListItem = await getPicListItem(pic);
    picList.appendChild(picListItem);
  }

  return picList;
};

/**
 * Builds li with pic data a single picture
 * @function getPicListItem
 * @param {Object} pic - Picture data object
 * @returns {Promise<HTMLElement>} A DOM list item containing the picture
 */
const getPicListItem = async (pic) => {
  const picListItem = document.createElement("li");
  picListItem.className = "pic-list-item";

  const picElement = await getPicElement(pic);
  picListItem.append(picElement);

  return picListItem;
};

/**
 * Builds img element for single pic by parsing pic data
 * Defines path to stored pic on fs as img src
 * @function getPicElement
 * @param {Object} pic - Picture data object
 * @returns {Promise<HTMLElement>} An img element with the picture
 */
const getPicElement = async (pic) => {
  const picElement = document.createElement("img");
  picElement.className = "pic-item";
  console.log(pic);

  //get the path
  const fileNameRaw = pic.picPath;
  const fileName = fileNameRaw.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  //add to element
  picElement.src = picPath;
  picElement.alt = "KCNA Image";

  return picElement;
};
