chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkContent") {
        // Simulated or real database lookup
      
                const progressCompleted = true;
               

                if (progressCompleted) {
                    chrome.scripting.executeScript({
                        target: { tabId: sender.tab.id },
                        files: ["popup.js"], // Make sure this file is in the correct location
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error executing script:", chrome.runtime.lastError.message);
                        } else {
                            console.log("popup.js executed successfully");
                        }
                    });
                }
                return true; // Keeps the sendResponse channel open
        }});
       
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
