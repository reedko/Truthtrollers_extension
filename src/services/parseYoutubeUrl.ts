export const extractVideoIdFromUrl = (url: string | null): string | null => {
  try {
    console.log("inregex1");

    // Check if the URL is null or undefined
    if (!url) {
      console.log("No URL provided");
      return null;
    }

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/([^&?]*))|youtu\.be\/([^&?]*))/;
    const match = url.match(youtubeRegex);

    console.log("videoId", match);

    // Check if there was a match and return the appropriate group
    return match ? match[1] || match[2] : null;
  } catch (error) {
    console.error("Error in extractVideoIdFromUrl:", error);
    return null;
  }
};
