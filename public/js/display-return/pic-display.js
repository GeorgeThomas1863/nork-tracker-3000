export const buildArticlePicList = async (inputData) => {
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

//standard pic list display
export const buildPicList = async (inputData) => {
  const picList = document.createElement("ul");
  picList.className = "pic-list";

  for (const pic of inputData) {
    const picListItem = await getPicListItem(pic);
    picList.appendChild(picListItem);
  }

  return picList;
};

//pic input is an object
const getPicListItem = async (pic) => {
  const picListItem = document.createElement("li");
  picListItem.className = "pic-list-item";

  const picElement = await getPicElement(pic);
  picListItem.append(picElement);

  return picListItem;
};

const getPicElement = async (pic) => {
  const picElement = document.createElement("img");
  picElement.className = "pic-item";

  //get the path
  const fileNameRaw = pic.picPath;
  const fileName = fileNameRaw.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  //add to element
  picElement.src = picPath;
  picElement.alt = "KCNA Image";

  return picElement;
};
