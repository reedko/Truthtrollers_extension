// Listen for messages from content.js
// background.js


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getCurrentTabUrl") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].url) {
                sendResponse({ url: tabs[0].url });
            } else {
                sendResponse({ error: "Could not get the current tab's URL" });
            }
        });
        return true; // Keeps the sendResponse channel open for async operations
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkContent") {
      // Get the active tab's URL
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          const url = tabs[0]?.url;
          if (!url) return;

          // Call the backend to check if content exists
          try {
              const response = await fetch("http://localhost:5001/api/check-content", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url })
              });
             
              const data = await response.json();

              if (data.exists) {
               

                chrome.scripting.executeScript(
                {
                    target: { tabId: sender.tab.id },
                    func: (task, url, isDetected) => {
                        window.currentTabTask = task; // Store the task record globally
                        window.currentTabUrl = url;
                        window.isContentDetected = isDetected;
                    },
                    args: [data.task, url, data.task.progress === "Completed"]
                }, () => {
                    chrome.scripting.executeScript({
                        target: { tabId: sender.tab.id },
                        files: ["popup.js"], // Ensure this file exists
                    });
                });
            } else {
//no data found, return the url

            }
          } catch (error) {
              console.error("Error checking content:", error);
          }
      });

      return true; // Keeps the sendResponse channel open for async operations
  }
});

// content.js
/* chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Capturing Image");
    if (message.action === "captureImage") {
        const img = document.querySelector("img");
        sendResponse({ imageUrl: img ? img.src : null });
    }
}); */

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureImage") {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            
            const currentUrl = tabs[0].url;
            console.log(currentUrl);
            if (tabs[0].id) {



                console.log("Current URL:", currentUrl);

                if (!currentUrl) {
                    console.error("Current URL is undefined");
                    sendResponse({ error: "Current URL is undefined" });
                    return;
                }
                try{
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
                            if (url.indexOf("youtube.com") !== -1 && url.indexOf("/watch") !== -1) {
                                const urlObj = new URL(url);
                                const videoId = urlObj.searchParams.get("v");
                                console.log(videoId);
                                if (videoId) {
                                    img.src =`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                                    chosenImage = img;
                                    
                                }
                            }

                            // Example of capturing the first image found on the page
                            if (!chosenImage){
                            const images = document.querySelectorAll("img");
                           
                            images.forEach((img) => {
                                if (img.offsetHeight && img.offsetWidth && img.offsetParent !== null) {
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
                        args:[currentUrl]
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

  