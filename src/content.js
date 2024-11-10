// Listener for toggle messages to control the visibility of the overlay
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleTaskCard") {
    const taskCard = document.getElementById("popup-root");
    if (taskCard) {
      console.log("Toggling visibility of the popup");
      taskCard.classList.toggle("task-card-visible");
      taskCard.classList.toggle("task-card-hidden");
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "triggerCheckContent") {
    const { forceVisible } = message;
    chrome.runtime.sendMessage({
      action: "checkContent",
      forceVisible: forceVisible,
    });
  }
});

/* chrome.webNavigation.onCompleted.addListener(
  function (details) {
    // Send a message to the content script to execute checkContent
    chrome.tabs.sendMessage(details.tabId, {
      action: "checkContent",
      forceVisible: false,
    });
  },
  { url: [{ hostContains: "" }] }
); */

/* window.onload = function () {
  console.log("Page loaded, running checkContent...");
  chrome.runtime.sendMessage({ action: "checkContent", forceVisible: false });
}; */
/* setTimeout(() => {
  chrome.runtime.sendMessage({ action: "checkContent", forceVisible: false });
}, 5000); */
