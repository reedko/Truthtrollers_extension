import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Popup: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [taskFound, setTaskFound] = useState<boolean>(false);

  useEffect(() => {
    // Request the current tab's URL from the background script
    chrome.runtime.sendMessage({ action: "getCurrentTabUrl" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error getting current tab URL:",
          chrome.runtime.lastError.message
        );
      } else if (response && response.url) {
        console.log("Current tab URL:", response.url);
        setCurrentUrl(response.url);
        // Check if the task is detected
        if (response.task) {
          console.log("Task detected:", response.task);
          setTaskFound(true);
        }
      } else {
        console.error("No URL found in response");
      }
    });
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      <h3>Popup Content</h3>
      {currentUrl ? (
        <div>
          <p>Current Tab URL: {currentUrl}</p>
          {taskFound ? (
            <p style={{ color: "green" }}>
              Task detected! Details are available.
            </p>
          ) : (
            <p style={{ color: "red" }}>No task found for this URL.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Create the root and render the component
const container = document.getElementById("popup-root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Popup />);
}
export default Popup;
