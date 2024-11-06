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

// Ensure `popup-root` exists in the DOM
if (!document.getElementById("popup-root")) {
  const popupRoot = document.createElement("div");
  popupRoot.id = "popup-root";
  popupRoot.className = "task-card-hidden"; // Initially hidden
  document.body.appendChild(popupRoot);
}

setTimeout(() => {
  chrome.runtime.sendMessage({ action: "checkContent" });
}, 1000);
