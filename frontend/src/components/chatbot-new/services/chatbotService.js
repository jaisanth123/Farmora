const PYTHON_API_URL =
  import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8000";

export const chatbotService = {
  // Main chat endpoint
  async sendMessage(message, language = "english") {
    try {
      const requestBody = {
        message: message,
        language: language,
        session_id: Date.now().toString(),
      };

      const response = await fetch(`${PYTHON_API_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Chatbot error: ${response.status} - ${
            errorData.detail || errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  },

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/chatbot/health`);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },
};
