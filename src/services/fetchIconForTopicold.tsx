import axios from "axios";

/**
 * Fetches an icon for a given topic using the Noun Project API.
 * @param {string} topic - The topic for which to fetch an icon.
 * @returns {Promise<string | null>} - Returns the icon's URL or null if not found.
 */
export async function fetchIconForTopic(topic: string): Promise<string | null> {
  const API_URL = `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(
    topic
  )}&limit_to_public_domain=yes&thumbnail_size=84&limit=1`;

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_NOUNPROJECT_API_KEY}`,
      },
    });

    const icons = response.data?.icons;
    if (icons && icons.length > 0) {
      return icons[0].thumbnail_url || null;
    }

    console.warn(`No icons found for topic: ${topic}`);
    return null;
  } catch (error) {
    console.error(`Error fetching icon for topic "${topic}":`, error);
    return null;
  }
}
