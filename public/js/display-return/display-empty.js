const buildEmptyDisplay = async (inputData) => {
  const emptyElement = document.createElement("div");
  emptyElement.className = "empty-display";
  emptyElement.textContent = inputData.text;

  return emptyElement;
};

export default buildEmptyDisplay;
