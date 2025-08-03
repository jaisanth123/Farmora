import os
import httpx
from fastapi import HTTPException
from typing import Optional, Dict, Any
from datetime import datetime

class ChatbotService:
    """
    Service layer for chatbot business logic
    """

    def __init__(self):
        try:
            # Check for both backend and frontend environment variable names
            self.gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
            self.gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

            # Don't raise error on startup, handle it during API calls
            if not self.gemini_api_key:
                print("Warning: GEMINI_API_KEY or VITE_GEMINI_API_KEY environment variable is not set. Chatbot will not function properly.")
            else:
                print(f"Gemini API key loaded successfully. Length: {len(self.gemini_api_key)}")
                print(f"Using model: gemini-2.0-flash")
        except Exception as e:
            print(f"Error initializing ChatbotService: {e}")
            self.gemini_api_key = None

    async def generate_ai_response(self, user_message: str, language: str = "english") -> str:
        """
        Generate AI response using Gemini API
        """
        try:
            # Check if API key is available
            if not self.gemini_api_key:
                raise HTTPException(
                    status_code=503,
                    detail="Gemini API key not configured. Please set GEMINI_API_KEY or VITE_GEMINI_API_KEY environment variable."
                )

            print(f"Generating AI response for: {user_message[:50]}...")

            system_prompt = self._build_system_prompt(language)

            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": f"{system_prompt}\n\nUser message: {user_message}"
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }

            print("Making request to Gemini API...")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.gemini_api_url}?key={self.gemini_api_key}",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=30.0
                )

                print(f"Gemini API response status: {response.status_code}")

                if response.status_code != 200:
                    error_data = response.json()
                    print(f"Gemini API error: {error_data}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Gemini API error: {error_data.get('error', {}).get('message', 'Unknown error')}"
                    )

                data = response.json()
                print(f"Gemini API response data keys: {list(data.keys())}")

                if data.get("candidates") and data["candidates"][0].get("content"):
                    response_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"Generated response: {response_text[:100]}...")
                    return response_text
                else:
                    print(f"Invalid response format: {data}")
                    raise HTTPException(status_code=500, detail="Invalid response format from Gemini API")

        except Exception as e:
            print(f"Unexpected error: {e}")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    def _build_system_prompt(self, language: str) -> str:
        """
        Build the system prompt for the AI assistant
        """
        base_prompt = """You are an expert AI virtual agronomist designed to help farmers with agricultural decisions.

Focus areas:
- Crop recommendations based on soil type, climate, and region
- Seasonal farming advice and planting calendars
- Market-driven crop selection based on current demand trends
- Pest and disease identification from symptom descriptions
- Treatment recommendations for plant diseases and pest infestations
- Current market prices and agricultural economics analysis
- Sustainable farming practices and resource optimization

Guidelines:
1. Provide concise, practical advice that farmers can implement
2. Include specific crop varieties, treatments, or techniques when applicable
3. Base recommendations on established agricultural science and data
4. Keep responses brief but informative (under 300 words when possible)
5. Ask clarifying questions if location, soil type, or other key details are missing
6. When given symptoms of plant problems, diagnose the likely disease or pest and suggest solutions

IMPORTANT PRICE QUERY INSTRUCTIONS:
7. For market price questions (e.g., "what is the price of turmeric today", "potato price", "tomato cost"):
   - Always provide a direct, specific price in the format "[price] rupees per kg" as the first line
   - Example: "50 rupees per kg. Turmeric prices have increased 5% since last week..."
   - Include brief market trends or factors affecting price if relevant
   - If location is provided, adjust price estimation to that region
   - Keep price responses extremely concise and straightforward

8. For greetings or introductions, keep them very short and friendly (1-2 sentences maximum)
9. Skip lengthy introductions and get straight to helpful information"""

        if language == "tamil":
            base_prompt += "\n\nPlease respond in Tamil language."
        else:
            base_prompt += "\n\nPlease respond in English language."

        return base_prompt

    async def process_message(self, message: str, language: str = "english", session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat message and return structured response
        """
        try:
            print(f"Processing message: {message}")

            # Validate input
            if not message or not message.strip():
                raise HTTPException(status_code=400, detail="Message is required")

            # Generate AI response
            ai_response = await self.generate_ai_response(message, language)

            result = {
                "success": True,
                "response": ai_response,
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "language": language
            }

            print(f"Processed message successfully. Response length: {len(ai_response)}")
            return result

        except HTTPException:
            raise
        except Exception as e:
            print(f"Error processing message: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

# Create singleton instance
try:
    chatbot_service = ChatbotService()
    print("ChatbotService initialized successfully")
except Exception as e:
    print(f"Error creating ChatbotService: {e}")
    chatbot_service = None
