const buildEmptyDisplay = async (inputData) => {
  const emptyElement = document.createElement("div");
  emptyElement.className = "empty-display";
  emptyElement.innerHTML = inputData.text;

  return emptyElement;
};

export default buildEmptyDisplay;
