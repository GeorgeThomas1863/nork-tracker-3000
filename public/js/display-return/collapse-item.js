const buildCollapseDisplay = async (titleInput, contentInput, startExpanded = false) => {
  //define / create things
  const collapseListItem = document.createElement("li");
  const collapseHeader = document.createElement("div");
  const collapseTitle = document.createElement("span");
  const collapseContent = document.createElement("div");

  //will prob have to change this
  const arrow = document.createElement("span");

  //add classes
  collapseListItem.className = "collapse-list-item";
  collapseHeader.className = "collapsible-header";
  collapseTitle.className = "collapsible-title";
  collapseContent.className = "collapsible-content";
  arrow.className = "collapsible-arrow";

  //will prob have to change the below arrow display logic
  if (startExpanded) {
    arrow.classList.add("expanded");
  }

  //some shit about "aria" will prob need to remove
  collapseHeader.setAttribute("role", "button");
  collapseHeader.setAttribute("aria-expanded", startExpanded ? "true" : "false");
  collapseHeader.setAttribute("aria-controls", `content-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  collapseContent.id = collapseHeader.getAttribute("aria-controls");

  if (!startExpanded) {
    collapseContent.classList.add("hidden");
  }

  //set arrow //NEED to start using below syntax for if / else
  // startExpanded ? (arrow.textContent = "▼") : ((arrow.textContent = "▶"), collapseContent.classList.add("hidden"));

  //Set title
  collapseTitle.textContent = titleInput;

  // Assemble header
  collapseHeader.appendChild(arrow);
  collapseHeader.appendChild(collapseTitle);

  // if (!startExpanded) collapseContent.classList.add("hidden");

  // Add content
  collapseContent.appendChild(contentInput);

  //will prob need to change, some shit aobut aria (claude's second attempt)
  collapseHeader.addEventListener("click", () => {
    // Just toggle classes and let CSS handle the animations
    collapseContent.classList.toggle("hidden");
    arrow.classList.toggle("expanded");
    collapseHeader.setAttribute("aria-expanded", collapseHeader.getAttribute("aria-expanded") === "true" ? "false" : "true");
  });

  // Assemble and return
  collapseListItem.appendChild(collapseHeader);
  collapseListItem.appendChild(collapseContent);
  return collapseListItem;
};

export default buildCollapseDisplay;
