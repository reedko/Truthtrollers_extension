// services/ldaTopics.ts
import axios from "axios";

export const getTopicsFromText = async (content: string) => {
  try {
    const response = await axios.post("http://localhost:5000/api/analyze", {
      content,
    });
    return response.data.topics;
  } catch (error) {
    console.error("Error extracting topics:", error);
    return [];
  }
};
