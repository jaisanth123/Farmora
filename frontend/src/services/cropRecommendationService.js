const PYTHON_API_URL =
  import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8000";

export const cropRecommendationService = {
  // Seasonal crop recommendation
  async getSeasonalRecommendation(district, season) {
    try {
      const response = await fetch(
        `${PYTHON_API_URL}/api/crop-recommendation/seasonal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            district: district,
            season: season,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Seasonal recommendation error: ${response.status} - ${
            errorData.detail || errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting seasonal recommendation:", error);
      throw error;
    }
  },

  // Soil-based crop recommendation
  async getSoilBasedRecommendation(soilParams) {
    try {
      const response = await fetch(
        `${PYTHON_API_URL}/api/crop-recommendation/soil-based`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(soilParams),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Soil-based recommendation error: ${response.status} - ${
            errorData.detail || errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting soil-based recommendation:", error);
      throw error;
    }
  },

  // Demand-based crop recommendation
  async getDemandRecommendation(district) {
    try {
      const response = await fetch(
        `${PYTHON_API_URL}/api/crop-recommendation/demand`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            district: district,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Demand recommendation error: ${response.status} - ${
            errorData.detail || errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting demand recommendation:", error);
      throw error;
    }
  },
};
