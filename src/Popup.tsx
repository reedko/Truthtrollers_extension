import "./Popup.css";
import resizeImage from "../services/image-url";
import { Image, ChakraProvider } from "@chakra-ui/react";
import { Task } from "../entities/useTask";
import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import ReactDOM from "react-dom/client";

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
    <ChakraProvider>
      <div>
        <TaskCard task={task} />
      </div>
    </ChakraProvider>
  );
};

const popupRoot = document.getElementById("popup-root");
if (popupRoot) {
  popupRoot.style.position = "fixed";
  popupRoot.style.top = "0";
  popupRoot.style.right = "0";
  popupRoot.style.zIndex = "9999";
  console.log("Found popup-root, rendering Popup component...");
  const root = ReactDOM.createRoot(popupRoot);

  root.render(<Popup />);
} else {
  console.error("popup-root not found, cannot render Popup");
}

export default Popup;
