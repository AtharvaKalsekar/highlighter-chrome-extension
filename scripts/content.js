const Mark = window.Mark;

window.onmouseup = (event) => {
  const { altKey, ctrlKey } = event;
  if (altKey && ctrlKey) {
    const markInstance = new Mark(document.body);
    const selectedText = document.getSelection().toString();
    markInstance.mark(selectedText, {
      separateWordSearch: false,
      diacritics: false,
    });
    saveHighlight(selectedText);
  }
};

const saveHighlight = (highlight) => {
  chrome.runtime.sendMessage(
    {
      action: "saveHighlight",
      data: {
        highlight,
      },
    },
    (status) => {
      console.log("saved => ", status);
    }
  );
};

chrome.runtime.sendMessage(
  {
    action: "getHighlightsForCurrentPage",
    data: {},
  },
  (highlights) => {
    const markInstance = new Mark(document.body);
    highlights.forEach((str) => {
      markInstance.mark(str, {
        separateWordSearch: false,
        diacritics: false,
      });
    });
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  $("html, body").animate(
    {
      scrollTop: $(`*:contains(${message.data}):last`).offset().top,
    },
    400
  );
  return true;
});
