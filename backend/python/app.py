import os
from dotenv import load_dotenv

# Load environment variables FIRST, before importing any other modules
load_dotenv()

# Debug: Check if environment variables are loaded
gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
print(f"Environment variables loaded. Gemini key available: {bool(gemini_key)}")
if gemini_key:
    print(f"Gemini key length: {len(gemini_key)}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.lon import router as coordinates_router
from utils.weather import router as environmental_router
# from utils.multilingual import router as multilingual_router
from models.crop_recommend.crop_recommend import router as crop_recommend_router
from models.pest.pest import router as pest_router
from models.crop_recommend.demand_crop import router as demand_router
from models.crop_recommend.seasonal import router as seasonal_router
from utils.info import router as info_router
from routes.chatbot_routes import router as chatbot_router
from routes.crop_recommendation_routes import router as crop_recommendation_router
app = FastAPI()
# # Add CORS middlewasdare
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],  # Your Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Including the routers for each endpoint with prefixes
app.include_router(info_router, prefix="/api")
app.include_router(coordinates_router, prefix="/api")
app.include_router(environmental_router, prefix="/api")
# app.include_router(multilingual_router, prefix="/api")
app.include_router(crop_recommend_router, prefix="/api")
app.include_router(pest_router, prefix="/api")
app.include_router(demand_router, prefix="/api")
app.include_router(seasonal_router, prefix="/api")

# Chatbot and crop recommendation routes
app.include_router(chatbot_router, prefix="/api")
app.include_router(crop_recommendation_router, prefix="/api")




# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the API!"}

# Test endpoint for chatbot
@app.get("/test-chatbot")
def test_chatbot():
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
    return {
        "message": "Chatbot test endpoint",
        "gemini_key_available": bool(gemini_key),
        "gemini_key_length": len(gemini_key) if gemini_key else 0
    }

# Simple test endpoint
@app.post("/test-simple")
def test_simple(request: dict):
    return {"message": "Simple test successful", "received": request}
