const buildTGDisplay = async (inputData) => {
  //dumb way to do below, UNFUCK THIS (ask claude)
  let pics = inputData.pics;
  let articles = inputData.articles;
  if (!pics) pics = 0;
  if (!articles) articles = 0;

  const tgContainer = document.createElement("ul");
  const tgElement = document.createElement("li");

  tgContainer.className = "empty-container";
  tgElement.className = "empty-text";

  const displayText = `Data successfully uploaded to Telegram. <br><h2>${pics} Pics and ${articles} Articles posted.</h2>`;

  tgElement.innerHTML = displayText;
  tgContainer.append(tgElement);

  return tgContainer;
};

export default buildTGDisplay;
