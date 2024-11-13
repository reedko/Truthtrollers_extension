import { useState, useEffect } from "react";
import axios from "axios";
import YouTubeTranscriptApi from "youtube-transcript-api";
import { Readability } from "@mozilla/readability"; // For web page content extraction

// Helper function to extract YouTube transcript
const getYoutubeTranscript = async (videoId: string) => {
  try {
    const transcript = await YouTubeTranscriptApi.getTranscript(videoId);
    return transcript.map((entry: { text: any }) => entry.text).join(" "); // Combine transcript text into one string
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    return null;
  }
};

// Helper function to extract the main content from a URL (HTML pages)
const extractContentFromUrl = async (url: string) => {
  try {
    const response = await axios.get(url);
    const doc = new Readability(document).parse();
    return doc?.textContent; // Extract main content using Readability
  } catch (error) {
    console.error("Error extracting content from URL:", error);
    return null;
  }
};

// Main custom hook
const useUrlDetailsExtraction = (url?: string, videoId?: string) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let extractedContent: string | null | undefined = null;
        if (videoId) {
          // If it's a YouTube URL, get the transcript
          extractedContent = await getYoutubeTranscript(videoId);
        } else if (url) {
          // If it's a regular URL, extract content from the page
          extractedContent = await extractContentFromUrl(url);
        }

        if (extractedContent) {
          setContent(extractedContent);
        } else {
          setError("Unable to extract content.");
        }
      } catch (err) {
        console.error("Error in content extraction:", err);
        setError("Error extracting content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [url, videoId]);

  return { content, loading, error };
};

export default useUrlDetailsExtraction;
