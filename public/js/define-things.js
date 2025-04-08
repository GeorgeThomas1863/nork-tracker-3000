/**
 * @fileoverview DOM element reference OBJECT for frontend elements
 * @module frontend/define-things
 *
 * Centralizes all DOM element selections for the application UI,
 * providing a single object for referencing interface elements.
 */

//Defines all frontend dom elements, puts elements into obj for easier seleciton
const d = {
  //action buttons
  scrapeKcnaActionButton: document.getElementById("scrape-kcna-action-button"),
  trackCryptoActionButton: document.getElementById("track-crypto-action-button"),

  //wrapper
  scraperWrapper: document.getElementById("scraper-wrapper"),

  //list items
  scrapeTypeListItem: document.getElementById("scrapeType-list-item"),
  pullNewDataListItem: document.getElementById("newData-list-item"),
  urlInputListItem: document.getElementById("urlInput-list-item"),
  howManyListItem: document.getElementById("howMany-list-item"),
  scrapeToListItem: document.getElementById("scrapeTo-list-item"),
  tgIdListItem: document.getElementById("tgId-list-item"),

  scrapeType: document.getElementById("scrapeType"),
  scrapeBoth: document.getElementById("scrapeBoth"),
  scrapePics: document.getElementById("scrapePics"),
  scrapeArticles: document.getElementById("scrapeArticles"),
  scrapeURL: document.getElementById("scrapeURL"),
  restartAuto: document.getElementById("restartAuto"),

  scrapeTo: document.getElementById("scrapeTo"),
  displayHere: document.getElementById("displayHere"),
  displayTG: document.getElementById("displayTG"),

  pullNewData: document.getElementById("pullNewData"),
  noNewData: document.getElementById("noNewData"),
  yesNewData: document.getElementById("yesNewData"),

  //inputs
  urlInput: document.getElementById("urlInput"),
  howMany: document.getElementById("howMany"),
  tgId: document.getElementById("tgId"),

  //submit button
  submitButton: document.getElementById("submit-button"),

  //define return display and make pretty elements
  dataReturnWrapper: document.getElementById("data-return-wrapper"),
  dataReturnElement: document.getElementById("data-return-element"),

  //ADMIN page
  startWorkerButton: document.getElementById("start-worker"),
  stopWorkerButton: document.getElementById("stop-worker"),
  restartWorkerButton: document.getElementById("restart-worker"),
  runNowButton: document.getElementById("run-now"),
};

//add in array to obj
d.listItemArray = [d.urlInputListItem, d.pullNewDataListItem, d.howManyListItem, d.scrapeToListItem, d.tgIdListItem];

export default d;
