import d from "./define-things.js";
import { parseDataReturn } from "./display-return/parse-return.js";

//HIDE ARRAY
const hideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.add("hidden");
  }
};

//UNHIDE ARRAY
const unhideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.remove("hidden");
    // input.classList.remove("#fuck-forms li.hidden");
  }
};

export const runActionButtonDisplay = async (buttonClicked) => {
  //adult way with switch case
  switch (buttonClicked) {
    case d.scrapeKcnaActionButton.id:
      await unhideArray([d.scraperWrapper]);
      break;

    case d.trackCryptoActionButton.id:
      await hideArray([d.scraperWrapper]);
      break;
  }
};

export const runScrapeTypeDisplay = async (buttonClicked) => {
  //hide everything to start
  await hideArray(d.listItemArray);

  //claude's version with select case
  switch (buttonClicked) {
    case d.restartAuto.id:
      await unhideArray([d.tgIdListItem]);
      break;

    case d.scrapeURL.id:
      await unhideArray([d.urlInputListItem, d.scrapeToListItem]);
      break;

    case d.scrapeBoth.id: //both
    case d.scrapePics.id: //pics
    case d.scrapeArticles.id: //articles
      await unhideArray([d.howManyListItem, d.scrapeToListItem, d.pullNewDataListItem]);
      break;
  }

  //figure out if tg chat ID should be hidden
  if (d.scrapeTo.value === displayTG.id) {
    await unhideArray([d.tgIdListItem]);
  }
};

export const runScrapeToDisplay = async (buttonClicked) => {
  //hide start
  await hideArray([d.tgIdListItem]);

  switch (buttonClicked) {
    case d.displayTG.id: //tgId
      await unhideArray([d.tgIdListItem]);
  }
};

//parses json array
export const displayDataReturn = async (inputData) => {
  //check if data received
  if (!inputData || !inputData.dataArray) return;

  const displayData = await parseDataReturn(inputData);

  //clear previous input
  d.dataReturnElement.innerHTML = "";

  d.dataReturnElement.appendChild(displayData);
  d.dataReturnWrapper.classList.remove("hidden");
  return;
};
