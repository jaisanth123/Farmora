from fastapi import APIRouter, HTTPException
from models.chatbot_models import ChatRequest, ChatResponse, HealthResponse
from controllers.chatbot_controller import ChatbotController

router = APIRouter()

@router.post("/chatbot/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chatbot endpoint that handles user messages and returns AI responses
    """
    try:
        print(f"Received chat request: {request.message}")
        print(f"Language: {request.language}")
        print(f"Session ID: {request.session_id}")

        response_data = await ChatbotController.process_chat_message(
            message=request.message,
            language=request.language,
            session_id=request.session_id
        )

        print(f"Response generated: {response_data['response'][:100]}...")
        return ChatResponse(**response_data)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")

@router.get("/chatbot/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint for the chatbot service
    """
    try:
        health_data = await ChatbotController.get_health_status()
        return HealthResponse(**health_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
