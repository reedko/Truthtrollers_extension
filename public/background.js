// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "injectPopup") {
      // Use chrome.scripting.executeScript() to inject popup.js into the page
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ["popup.js"], // Make sure popup.js exists in the public folder
      });
    }
  });
  