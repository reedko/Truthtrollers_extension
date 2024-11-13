import React, { useState, useEffect } from "react";
import useMainHeadline from "./useMainHeadline";
import createTask from "../services/createTask";
import { extractVideoIdFromUrl } from "../services/parseYoutubeUrl";
import { getTopicsFromText } from "../services/ldaTopics";
import useUrlDetailsExtraction from "../hooks/useUrlDetailsExtraction"; // Import custom hook

export const useTask = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const mainHeadline = useMainHeadline(searchUrl);
  console.log("useTask executed", searchUrl);
  const handleCaptureImage = (
    callback: (response: { imageUrl?: string }) => void
  ): void => {
    chrome.runtime.sendMessage(
      { action: "captureImage" },
      (response: { imageUrl?: string }) => {
        callback(response);
      }
    );
  };
  const videoId = extractVideoIdFromUrl(searchUrl || undefined);

  const { content, loading, error } = useUrlDetailsExtraction(
    searchUrl || undefined, // Pass undefined if searchUrl is null
    videoId ? videoId : undefined // Only pass videoId if it's a valid string, otherwise pass undefined
  );

  useEffect(() => {
    if (mainHeadline && content) {
      handleCaptureImage(async (response) => {
        let imageUrl = response.imageUrl;

        if (!imageUrl) {
          console.log("No image URL found.");
          return;
        }

        // If the content is ready, process it through LDA for topic modeling
        const topics = await getTopicsFromText(content); // Get topics from LDA

        const taskData = {
          task_name: mainHeadline || "New Task",
          url: searchUrl,
          media_source: "Auto-detected source",
          topic: topics.length ? topics[0] : "General", // Use the first topic
          subtopic: topics.length > 1 ? topics[1] : "N/A", // Assign subtopic
          users: "",
          details: searchUrl,
          thumbnail_url: imageUrl,
          assigned: "unassigned",
          progress: "unassigned",
        };

        // Create task using the API service
        createTask(taskData);

        // Close popup and re-check content
        const popupRoot = document.getElementById("popup-root");
        if (popupRoot) {
          popupRoot.remove();
        }

        setTimeout(() => {
          chrome.runtime.sendMessage({
            action: "checkContent",
            forceVisible: true,
          });
        }, 3000);
      });
    } else {
      console.error("Error: No content or headline found.");
    }
  }, [mainHeadline, content, searchUrl]);

  const handleScrape = (pageUrl: string | null) => {
    if (pageUrl && pageUrl !== searchUrl) {
      console.log("Scraping new URL:", pageUrl);
      setSearchUrl(pageUrl);
    }
  };

  return { handleScrape };
};
