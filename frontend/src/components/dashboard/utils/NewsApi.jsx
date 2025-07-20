// src/api/NewsApi.jsx
import axios from "axios";

export const fetchAgricultureNews = async () => {
  try {
    console.log("Attempting to fetch agriculture news...");

    // Use a relative path instead of the absolute URL to avoid CSP issues
    // This assumes you have a proxy set up in your frontend development server
    const response = await axios.get("/api/news");
    console.log("API response:", response.data);

    // The response should already be in the expected format from your FastAPI server
    return response.data;
  } catch (error) {
    console.error("Error fetching agriculture news:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return [];
  }
};

// Function to fetch detailed news content
export const fetchNewsDetail = async (newsId) => {
  try {
    console.log("Fetching detailed news for ID:", newsId);
    const response = await axios.get(`/api/news/${newsId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return null;
  }
};
