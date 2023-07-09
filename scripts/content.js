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
    action: "getAllHighlights",
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

// fetch(
//   "http://localhost:3000/atharva?url=https://en.wikipedia.org/wiki/Flow_(Japanese_band)"
// )
//   .then((data) => data.json())
//   .then((resp) => {
//     console.log({ resp });
//   })
//   .catch((e) => {
//     console.log("fetch error: ", e);
//   });

// fetch(
//   "http://localhost:3000/atharva?url=https://en.wikipedia.org/wiki/Flow_(Japanese_band)",
//   {
//     method: "POST",
//     body: JSON.stringify({
//       highlight: ["the band has released 39 singles"],
//     }),
//   }
// )
//   .then((resp) => {
//     console.log("22", { resp });
//   })
//   .catch((e) => {
//     console.log("fetch error 2: ", e);
//   });

// "permissions": ["scripting", "activeTab"]

// "permissions": ["tabs", "scripting"],
//  "host_permissions": ["http://*/*", "https://*/*"]
