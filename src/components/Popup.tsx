import "./Popup.css";
import resizeImage from "../services/image-url";
import { Image } from "@chakra-ui/react";
import { Task } from "../entities/useTask";
import React, { useEffect, useState } from "react";

const Popup: React.FC = () => {
  const [isInDatabase, setIsInDatabase] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [isContentDetected, setIsContentDetected] = useState<boolean>(false);

  useEffect(() => {
    // Directly read from the global `window` object
    const currentTask = (window as any).currentTabTask || null;
    const detected = (window as any).isContentDetected || false;
    const currentUrl = (window as any).currentTabUrl || false;
    if (currentTask) {
      setTask(currentTask);
      setPageUrl(currentUrl);
      setIsContentDetected(detected);

      console.log("Task loaded from global context:", currentTask);
    } else {
      console.log("No task found in global context. Checking content...");
      // If no task is found in the global context, request from background.js
      chrome.runtime.sendMessage(
        { action: "checkContent", url: window.location.href },
        (response) => {
          if (response && response.task) {
            setTask(response.task);
            setPageUrl(response.url);
            setIsContentDetected(false);
            console.log("Task received from background:", response.task);
          }
        }
      );
    }
  }, []);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleCaptureImage = () => {
    chrome.runtime.sendMessage({ action: "captureImage" }, (response) => {
      if (response && response.imageUrl) {
        setImageUrl(response.imageUrl);
      } else {
        console.error("Failed to capture image");
      }
    });
  };
  const handleScrape = async () => {
    handleCaptureImage();
    if (!imageUrl) {
      console.log("No image URL found");
      return;
    }

    // Send task data, including the image URL, to the backend
    const taskData = {
      task_name: pageUrl || "New Task",
      url: pageUrl,
      media_source: "Auto-detected source",
      topic: "General",
      subtopic: "N/A", // Send the captured image URL
      users: "",
      details: pageUrl,
      thumbnail_url: imageUrl,
    };

    try {
      const response = await fetch("http://localhost:5001/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      console.log("Task added with ID:", data.task_id);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="popup-box">
      {isContentDetected ? (
        <>
          <div className="popup-box-text">TruthTroll at 80% FALSE</div>
          <div className="image-container">
            {resizeImage(120, "../../assets/images/meter3.png")}
          </div>
          <div className="popup-buttons">
            <a
              href={task?.details || "#"}
              className="popup-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="popup-button-text">Details</div>
            </a>
            <div
              className="popup-button"
              onClick={() => {
                // Close the popup by removing the root element
                const popupRoot = document.getElementById("popup-root");
                if (popupRoot) {
                  popupRoot.remove();
                }
              }}
            >
              <div className="popup-button-text">Close</div>
            </div>
          </div>
        </>
      ) : task ? (
        <>
          <div className="popup-box-text">
            {task?.task_name} at {task?.progress}
          </div>
          <Image
            src={chrome.runtime.getURL(task.thumbnail)} // Assuming thumbnail images are named as task_id_x.png
            alt="Thumbnail"
            borderRadius="md"
            boxSize="200px"
            objectFit="cover"
          />
          <div className="popup-buttons">
            <a
              href={task?.details || "#"}
              className="popup-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="popup-button-text">Details</div>
            </a>
            <div
              className="popup-button"
              onClick={() => {
                // Close the popup by removing the root element
                const popupRoot = document.getElementById("popup-root");
                if (popupRoot) {
                  popupRoot.remove();
                }
              }}
            >
              <div className="popup-button-text">Close</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="popup-button" onClick={handleScrape}>
            <div className="popup-button-text">Scrape</div>
          </div>
          <div className="popup-button" onClick={() => window.close()}>
            <div className="popup-button-text">Cancel</div>
          </div>
        </>
      )}
    </div>
  );
};
export default Popup;
