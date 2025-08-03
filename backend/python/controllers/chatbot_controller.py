from fastapi import HTTPException
from typing import Optional
from datetime import datetime
from services.chatbot_service import chatbot_service

class ChatbotController:
    """
    Controller for handling chatbot operations
    """

    @staticmethod
    async def process_chat_message(message: str, language: str = "english", session_id: Optional[str] = None):
        """
        Process a chat message and return AI response
        """
        try:
            # Check if chatbot service is available
            if chatbot_service is None:
                raise HTTPException(status_code=503, detail="Chatbot service is not available")

            # Use the chatbot service to process the message
            return await chatbot_service.process_message(message, language, session_id)

        except HTTPException:
            raise
        except Exception as e:
            print(f"Error in ChatbotController: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

    @staticmethod
    async def get_health_status():
        """
        Get chatbot service health status
        """
        try:
            return {
                "status": "ok",
                "service": "chatbot",
                "timestamp": datetime.now().isoformat(),
                "features": [
                    "gemini_ai_integration",
                    "multi_language_support",
                    "session_management"
                ]
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
