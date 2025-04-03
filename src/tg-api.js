import TgReq from "../models/tg-model.js";

let tokenIndex = 0;

/**
 * TG sendMessage API, sends message chunk to TG (chunk before using) with auto token rotation
 * @param {Object} params - Message parameters
 * @param {string} params.chat_id - Telegram chat ID to send message to
 * @param {string} params.text - Text content of the message
 * @param {string} [params.parse_mode] - Parsing mode (HTML, Markdown, etc.)
 * @returns {Promise<Object>} Response data from Telegram API
 */
export const sendMessageChunkTG = async (params) => {
  const tgModel = new TgReq(params);

  //check token
  let data = await tgModel.tgPost("sendMessage", tokenIndex);
  const checkData = await checkToken(data);
  if (checkData) data = await tgModel.tgPost("sendMessage", tokenIndex); //run again

  return data;
};

//-------------

/**
 * TG editMessageCaption API; edits the caption of a previously pic / message
 * @param {Object} inputObj - Response object from a previous sendPhoto API call
 * @param {Object} inputObj.result - Result object from Telegram
 * @param {Object} inputObj.result.chat - Chat info
 * @param {string} inputObj.result.chat.id - Chat ID
 * @param {number} inputObj.result.message_id - Message ID to edit
 * @param {string} caption - New caption text for the media
 * @returns {Promise<Object>} Response data from Telegram API
 */
export const editCaptionTG = async (inputObj, caption) => {
  //build params
  const params = {
    chat_id: inputObj.result.chat.id,
    message_id: inputObj.result.message_id,
    caption: caption,
  };

  const tgModel = new TgReq(params);

  let data = await tgModel.tgPost("editMessageCaption", tokenIndex);
  const checkData = await checkToken(data);
  if (checkData) data = await tgModel.tgPost("editMessageCaption", tokenIndex); //if fucked run again

  return data;
};

/**
 * TG sendPhoto API, posts images to TG channel / user, with auto token rotation
 * @param {Object} params - Upload parameters
 * @param {string} params.chatId - Telegram chat ID to send picture to
 * @param {string} params.picPath - Local file path of the picture to upload
 * @returns {Promise<Object>} Response data from Telegram API
 */
export const uploadPicsTG = async (params) => {
  const tgModel = new TgReq(params);

  //check token
  let data = await tgModel.tgPicFS(tokenIndex);
  const checkData = await checkToken(data);
  if (checkData) data = await tgModel.tgPicFS(tokenIndex); //run again

  return data;
};

/**
 * Handles TG rate limiting by checking response looking for error code 429) and rotates to NEXT bot / token
 * if error code present
 * @param {Object} data - Response data from Telegram API
 * @param {boolean} data.ok - Success status from API
 * @param {number} [data.error_code] - Error code if request failed
 * @returns {number|null} New token index if rotated, null if no rotation needed
 * @private
 */
const checkToken = async (data) => {
  //429 bot fucked error
  if (!data || (data && data.ok) || (data && !data.ok && data.error_code !== 429)) return null;

  tokenIndex++;
  if (tokenIndex > 11) tokenIndex = 0;

  console.log("GOT 429 ERROR, TRYING NEW FUCKING BOT. TOKEN INDEX: " + tokenIndex);
  return tokenIndex;
};

export default sendMessageChunkTG;
