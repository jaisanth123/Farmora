from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    """
    Model for incoming chat requests
    """
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    language: Optional[str] = Field(default="english", description="Language preference")
    session_id: Optional[str] = Field(default=None, description="Session identifier")

class ChatResponse(BaseModel):
    """
    Model for chat responses
    """
    success: bool = Field(..., description="Request success status")
    response: str = Field(..., description="AI generated response")
    session_id: Optional[str] = Field(default=None, description="Session identifier")
    timestamp: str = Field(..., description="Response timestamp")
    language: Optional[str] = Field(default="english", description="Response language")

class HealthResponse(BaseModel):
    """
    Model for health check responses
    """
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")
    timestamp: str = Field(..., description="Health check timestamp")
    features: list = Field(..., description="Available features")
