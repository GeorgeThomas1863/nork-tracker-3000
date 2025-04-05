const buildEmptyDisplay = async (inputData) => {
  const emptyContainer = document.createElement("ul");
  const emptyElement = document.createElement("li");

  emptyContainer.className = "empty-container";
  emptyElement.className = "empty-text";

  emptyElement.innerHTML = inputData.text;
  emptyContainer.append(emptyElement);

  return emptyContainer;
};

export default buildEmptyDisplay;
