const PYTHON_API_URL =
  import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8000";

export const geminiService = {
  async generateResponse(userMessage, language = "english") {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          language: language,
          session_id: Date.now().toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Backend error: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (data.success && data.response) {
        return data.response;
      } else {
        throw new Error("Invalid response format from backend");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  },
};
