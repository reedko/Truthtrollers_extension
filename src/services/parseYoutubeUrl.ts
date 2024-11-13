// utils/parseYoutubeUrl.ts
export const extractVideoIdFromUrl = (url?: string) => {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/([^&?]*))|youtu\.be\/([^&?]*))/;
  const match = url?.match(youtubeRegex);
  return match ? match[1] || match[2] : null;
};
