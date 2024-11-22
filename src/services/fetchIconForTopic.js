const OAuth = require("oauth");
const { inspect } = require("util");
require("dotenv").config();

const KEY = process.env.REACT_APP_NOUNPROJECT_API_KEY || ""; // Default to an empty string if undefined
const SECRET = process.env.REACT_APP_NOUNPROJECT_SECRET_KEY || ""; // Default to an empty string if undefined

const oauth = new OAuth.OAuth(
  "https://api.thenounproject.com",
  "https://api.thenounproject.com",
  KEY,
  SECRET,
  "1.0",
  null,
  "HMAC-SHA1"
);

const fetchIconForTopic = async (query) => {
  const queryUrl = `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(
    query
  )}&limit_to_public_domain=yes&thumbnail_size=200&limit=1`;

  return new Promise((resolve, reject) => {
    oauth.get(queryUrl, "", "", (e, data, res) => {
      if (e) {
        console.error("Error fetching from Noun Project API:", e);
        reject(e);
        return;
      }

      try {
        const parsedData = JSON.parse(data?.toString() || "{}");
        const icons = parsedData?.icons;
        if (icons && icons.length > 0) {
          resolve(icons[0].thumbnail_url || null);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error("Error parsing API response:", error);
        reject(error);
      }
    });
  });
};

module.exports = fetchIconForTopic;
