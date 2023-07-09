const queryOptions = { active: true };

const populatePanel = (highlights, tabId) => {
  $("ul.list-container").empty();
  highlights.forEach((hlt) => {
    const listItem = $(`<li>${hlt}</li>`).click(() => {
      chrome.tabs.sendMessage(tabId, {
        action: "scroll",
        data: hlt,
      });
    });
    $("ul.list-container").append(listItem);
  });
};

const initSidePanel = () => {
  chrome.tabs.query(queryOptions, (tab) => {
    if (tab && tab[0]) {
      const { url, id } = tab[0];
      chrome.storage.local.get([url]).then((result) => {
        const { highlights } = result[url];
        populatePanel(highlights, id);
      });
    }
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message in side-panel", message);
  if (message.action === "refreshSidePanel") {
    initSidePanel();
  }
});

initSidePanel();
