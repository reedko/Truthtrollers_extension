import { useState } from "react";
import { getMainHeadline } from "../services/getMainHeadline"; // New headline extraction function
import { extractUrlDetails } from "../services/urlDetailsExtraction"; // Content extraction logic
import { getTopicsFromText } from "../services/ldaTopics"; // LDA service for topics
import createTask from "../services/createTask"; // Task creation service
import { extractVideoIdFromUrl } from "../services/parseYoutubeUrl"; // Helper for YouTube video IDs

export const useTaskScraper = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Main function to handle scraping and task creation
  const scrapeTask = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch the main headline
      const mainHeadline = await getMainHeadline(url);

      // Step 2: Extract content and YouTube transcript
      const videoId = extractVideoIdFromUrl(url); // Extract YouTube video ID
      console.log("videoId", videoId);
      const content = await extractUrlDetails(url, videoId); // Extract content or transcript
      if (!content) {
        throw new Error("Failed to extract content.");
      }

      // Step 3: Extract topics from content
      const { topic, subtopic } = await getTopicsFromText(content);

      // Step 4: Capture image (if applicable)
      let imageUrl = "";
      await new Promise<void>((resolve) => {
        chrome.runtime.sendMessage(
          { action: "captureImage" },
          (response: { imageUrl?: string }) => {
            imageUrl = response.imageUrl || "";
            resolve();
          }
        );
      });

      if (!imageUrl) {
        console.log("No image URL found.");
        throw new Error("Image capture failed.");
      }

      // Step 5: Prepare task data
      const taskData = {
        task_name: mainHeadline || "New Task",
        media_source: videoId ? "YouTube" : "Web",
        url,
        assigned: "unassigned",
        progress: "Unassigned",
        users: "",
        details: url,
        topic,
        subtopic,
        thumbnail_url: imageUrl,
      };

      // Step 6: Create task in the database
      await createTask(taskData);

      // Step 7: Notify `checkContent` for TaskCard visibility
      chrome.runtime.sendMessage({
        action: "checkContent",
        forceVisible: true,
      });

      console.log("Task creation successful:", taskData);
    } catch (err) {
      console.error("Error during task scraping:", err);
      setError("An error occurred while scraping.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    scrapeTask, // Expose function to trigger scraping
  };
};
