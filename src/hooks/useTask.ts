import React, { useEffect, useState } from "react";
import useMainHeadline from "./useMainHeadline";

export const useTask = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  interface CaptureImageResponse {
    imageUrl?: string;
  }
  const [searchUrl, setSearchUrl] = useState<string | null>(null);

  const mainHeadline = useMainHeadline(searchUrl);

  const handleCaptureImage = (
    callback: (response: CaptureImageResponse) => void
  ): void => {
    chrome.runtime.sendMessage(
      { action: "captureImage" },
      (response: CaptureImageResponse) => {
        callback(response);
      }
    );
  };

  useEffect(() => {
    if (mainHeadline) {
      // Proceed with task creation when mainHeadline is available
      handleCaptureImage((response) => {
        let imageUrl = response.imageUrl;

        if (!imageUrl) {
          console.log("No image URL found.");
          return;
        }

        // Send task data, including the image URL, to the backend
        const taskData = {
          task_name: mainHeadline || "New Task",
          url: searchUrl,
          media_source: "Auto-detected source",
          topic: "General",
          subtopic: "N/A",
          users: "",
          details: searchUrl,
          thumbnail_url: imageUrl,
          assigned: "unassigned",
          progress: "unassigned",
        };

        // Send taskData to your backend here

        try {
          fetch("http://localhost:5001/api/scrape", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
          })
            .then((response) => response.text())
            .then((text) => console.log("Response text:", text));

          const popupRoot = document.getElementById("popup-root");
          if (popupRoot) {
            console.log("re ovinng popup");
            popupRoot.remove();
            console.log("re oveed popup");
          }
          setTimeout(() => {
            // Send a message to re-check the content

            chrome.runtime.sendMessage({
              action: "checkContent",
              forceVisible: true,
            });
          }, 2000);
        } catch (error) {
          console.error("Error adding task:", error);
        }
      });
    }
  }, [mainHeadline, searchUrl]);

  const handleScrape = (pageUrl: string | null) => {
    if (!pageUrl) {
      console.error("No page URL provided. Cannot scrape.");
      return; // Early exit if pageUrl is null
    }
    setSearchUrl(pageUrl);
  };
  return { handleScrape };
};
