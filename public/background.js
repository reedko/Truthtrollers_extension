// Listen for messages from content.js
// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab's URL contains "youtube.com" and if the URL has changed

  // Send a message to re-check the content
  chrome.tabs.sendMessage(tabId, {
    action: "triggerCheckContent",
    forceVisible: false,
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "toggleTaskCard" });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getCurrentTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        sendResponse({ url: tabs[0].url });
      } else {
        console.error("No active tab or URL found");
        sendResponse({ error: "No active tab or URL found" });
      }
    });
    return true; // Keeps the sendResponse channel open for async responses
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkContent") {
    const { forceVisible } = message;
    console.log("fv1", forceVisible);
    // Get the active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (chrome.runtime.lastError) {
        console.error("Error querying tabs:", chrome.runtime.lastError.message);
        return;
      }
      if (tabs.length === 0 || !tabs[0].url) {
        console.error("No active tab or URL found.");
        return;
      }

      const url = tabs[0]?.url;
      if (!url) return;

      // Call the backend to check if content exists
      try {
        const response = await fetch(
          "http://localhost:5001/api/check-content",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          }
        );

        const data = await response.json();

        const isDetected = data.exists && data.task.progress === "Completed";
        const task = data.exists ? data.task : null;

        // Execute script to set globals and create popup-root if it doesn't exist
        chrome.scripting.executeScript(
          {
            target: { tabId: sender.tab.id },
            func: (task, url, isDetected, forceVisible) => {
              // Set global variables in the tab context
              window.currentTabTask = task;
              window.currentTabUrl = url;
              window.isContentDetected = isDetected;

              // Check if the popup-root div exists, if not, create it
              let popupRoot = document.getElementById("popup-root");
              if (!popupRoot) {
                popupRoot = document.createElement("div");
                popupRoot.id = "popup-root";
                document.body.appendChild(popupRoot);
              }
              console.log("fv2", forceVisible);
              console.log("isDetected:", isDetected);
              console.log("forceVisible:", forceVisible);
              if (isDetected || forceVisible) {
                popupRoot.className = "task-card-visible";
                console.log("fv3", isDetected);
                console.log("fv31", isDetected || forceVisible);
              } else {
                popupRoot.className = "task-card-hidden"; // Initially visible
                console.log("fv4", isDetected);
              }
            },
            args: [task, url, isDetected, forceVisible],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error during executeScript:",
                chrome.runtime.lastError.message
              );
            } else {
              console.log("Globals set and popup-root created if needed");

              chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ["popup.js"], // Ensure this file exists
              });
            }
          }
        );
      } catch (error) {
        console.error("Error checking content:", error);
      }
    });

    return true; // Keeps the sendResponse channel open for async operations
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureImage") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentUrl = tabs[0].url;
      console.log("test1");
      if (tabs[0].id) {
        console.log("Current URL:", currentUrl);

        if (!currentUrl) {
          console.error("Current URL is undefined");
          sendResponse({ error: "Current URL is undefined" });
          return;
        }
        try {
          console.log("test2");

          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              func: (url) => {
                console.log("test3");
                let maxArea = 0;
                let chosenImage = null;
                if (!url) {
                  console.error("Passed URL is undefined inside func");
                  return null;
                }
                //capture youtube image thumbnail iff
                if (
                  url.indexOf("youtube.com") !== -1 &&
                  url.indexOf("/watch") !== -1
                ) {
                  const urlObj = new URL(url);
                  const videoId = urlObj.searchParams.get("v");
                  console.log(videoId);
                  if (videoId) {
                    img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    chosenImage = img;
                  }
                }

                // Example of capturing the first image found on the page
                if (!chosenImage) {
                  const images = document.querySelectorAll("img");

                  images.forEach((img) => {
                    if (
                      img.offsetHeight &&
                      img.offsetWidth &&
                      img.offsetParent !== null
                    ) {
                      const area = img.offsetHeight * img.offsetWidth;
                      if (area > maxArea) {
                        maxArea = area;
                        chosenImage = img;
                      }
                    }
                  });
                }
                return chosenImage ? chosenImage.src : null;
              },
              args: [currentUrl],
            },
            (results) => {
              const imageUrl = results[0].result;
              sendResponse({ imageUrl });
            }
          );
        } catch (error) {
          console.error("Error during script execution:", error);
        }
      }
    });
    // This is necessary to indicate that sendResponse will be called asynchronously
    return true;
  }
});
