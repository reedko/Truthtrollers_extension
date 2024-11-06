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

setTimeout(() => {
  chrome.runtime.sendMessage({ action: "checkContent" });
}, 5000);
