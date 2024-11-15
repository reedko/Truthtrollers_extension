// services/ldaTopics.ts
import axios from "axios";

export const getTopicsFromText = async (content: string) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/analyze",
      {
        content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error extracting topics:", error);
    return [];
  }
};
