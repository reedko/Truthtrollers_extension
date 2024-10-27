// Function to inject the React popup using chrome.scripting.executeScript
function injectReactPopup() {
    // Check if the popup root already exists, if not, create it
    let popupRoot = document.getElementById("popup-root");
    if (!popupRoot) {
      popupRoot = document.createElement("div");
      popupRoot.id = "popup-root";
      document.body.appendChild(popupRoot);
  
      // Apply styles directly to force the root div to have size
      popupRoot.style.position = "fixed";
      popupRoot.style.top = "0";
      popupRoot.style.right = "0";
      popupRoot.style.zIndex = "9999";
      popupRoot.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // Add a visible background for testing
    }
  
    // After ensuring the popup root is created, send a message to background.js to inject popup.js
    chrome.runtime.sendMessage({ action: "injectPopup" });
  }
  
  // Check if the URL contains "youtube.com" or a specific string
  if (window.location.href.includes("youtube.com")) {
    // Wait for 1 second before checking the string
    setTimeout(() => {
      const targetString = "Genius"; // Customize this string
      const pageText = document.body.innerText || "";
      const isStringFound = pageText.includes(targetString);
  
      console.log("String detected:", isStringFound);
  
      // Only inject the React popup if the string is found
      if (isStringFound) {
        injectReactPopup();
      }
    }, 5000); // 1 second delay
  }