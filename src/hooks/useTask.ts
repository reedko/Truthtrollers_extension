import React, { useState } from "react";

export const useTask = () => {
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
  const handleScrape = async (pageUrl: string | null) => {
    if (!pageUrl) {
      console.error("No page URL provided. Cannot scrape.");
      return; // Early exit if pageUrl is null
    }
    handleCaptureImage();
    console.log("IMG");
    if (!imageUrl) {
      console.log("No image URL found. ");
      console.log("No image URL found. Inserting default");
      setImageUrl(chrome.runtime.getURL("assets/ttlogo11.png"));
      console.log(imageUrl);

      return;
    } else {
      console.log("IMG", imageUrl);
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
      assigned: "unassigned",
      progress: "unassigned",
    };

    try {
      const response = await fetch("http://localhost:5001/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const text = await response.text(); // Get response as text
      console.log("Response text:", text); // Log the raw response

      const data = JSON.parse(text); // Try to parse the text as JSON
      console.log("Task added with ID:", data.task_id);
      // Close the popup by removing the root element
      const popupRoot = document.getElementById("popup-root");
      if (popupRoot) {
        popupRoot.remove();
      }
      setTimeout(() => {
        chrome.runtime.sendMessage({
          action: "checkContent",
          forceVisible: true,
        });
      }, 1000);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return { handleScrape };
};
