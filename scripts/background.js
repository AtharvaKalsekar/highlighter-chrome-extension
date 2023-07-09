// const getAllHighlights = (url, sendResponse) => {
//   fetch(`http://localhost:3000/atharva?url=${url}`)
//     .then((res) => res.json())
//     .then((resp) => {
//       sendResponse(resp[0].highlights);
//     })
//     .catch((err) => {
//       console.log("Fetch error", err);
//       sendResponse([]);
//     });
// };

const utilSaveToStorge = (resp) => {
  resp.forEach((item) => {
    const { url } = item;
    chrome.storage.local.set({ [url]: item }).then(() => {
      console.log("Value is set");
    });
  });
};

const getAllHighlights = () => {
  fetch(`http://localhost:3000/atharva`)
    .then((res) => res.json())
    .then((resp) => {
      utilSaveToStorge(resp);
    })
    .catch((err) => {
      console.log("Fetch error", err);
    });
};

const getHighlightsForCurrentPage = (url, sendResponse) => {
  chrome.storage.local.get([url]).then((result) => {
    sendResponse(result[url].highlights);
  });
};

const saveHighlight = (pageUrl, highlight, sendResponse) => {
  chrome.storage.local.get([pageUrl]).then((result) => {
    const { id, highlights, url } = result[pageUrl];

    const putData = {
      url: url,
      highlights: [...highlights, highlight],
    };

    fetch(`http://localhost:3000/atharva/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putData),
    })
      .then((res) => res.json())
      .then((resp) => {
        utilSaveToStorge([resp]);
        sendResponse(true);
      })
      .catch((err) => {
        console.log("put error", err);
        sendResponse(false);
      });
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { url } = sender;
  if (request.action === "getAllHighlights") {
    getHighlightsForCurrentPage(url, sendResponse);
  } else if (request.action === "saveHighlight") {
    const { highlight } = request.data;
    saveHighlight(url, highlight, sendResponse);
  }
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  getAllHighlights();
});
