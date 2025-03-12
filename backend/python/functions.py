# Replace the googletrans import with deep-translator
from deep_translator import GoogleTranslator
from fastapi import APIRouter, HTTPException, Form, Request, Depends, Body
from fastapi.responses import JSONResponse
from gtts import gTTS
import uuid
import base64
import os
import io
import tempfile
import soundfile as sf
import sounddevice as sd

# Create a FastAPI router for your endpoints
router = APIRouter()

# Function to translate text to English (Tamil to English)
async def translate_text(text, source_lang="ta", target_lang="en"):
    try:
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        translated = translator.translate(text)
        return translated
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

# Endpoint for voice input in English - optimize for faster response
@router.post("/voice")
async def get_voice_input(request: Request):
    try:
        body = await request.json()
        recognized_text = body.get("text")
        if not recognized_text:
            raise HTTPException(status_code=400, detail="No text provided")
        
        # Process the text immediately without additional delay
        return JSONResponse(content={"text": recognized_text})
    except HTTPException as e:
        raise e
    except Exception as e:
        # Add better error handling for debugging
        print(f"Error in voice endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing voice input: {str(e)}")

# Endpoint for Tamil voice input and translation to English - optimize for faster response
@router.post("/tamil-voice")
async def tamil_voice_to_english(request: Request):
    try:
        body = await request.json()
        recognized_tamil = body.get("text")
        if not recognized_tamil:
            raise HTTPException(status_code=400, detail="No Tamil text provided")
        
        # Start translation immediately
        translated_english = await translate_text(recognized_tamil, source_lang="ta", target_lang="en")
        return JSONResponse(content={"recognized_tamil": recognized_tamil, "translated_english": translated_english})
    except HTTPException as e:
        raise e
    except Exception as e:
        # Add better error handling for debugging
        print(f"Error in tamil-voice endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing Tamil voice input: {str(e)}")

# Function to translate English to Tamil
async def translate_to_tamil(text: str, source_lang="en", target_lang="ta"):
    try:
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        translated = translator.translate(text)
        return translated
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

# Endpoint for translation from English to Tamil
@router.get("/translate-to-tamil")
async def translate_to_tamil_endpoint(input_text: str):
    try:
        translated_text = await translate_to_tamil(input_text)
        return {"translated_tamil": translated_text}
    except Exception as e:
        return {"error": str(e)}

# Endpoint to generate speech and return as base64
@router.post("/speak")
async def speak(text: str = Form(...), lang: str = Form("en")):
    try:
        # Create a temporary directory if it doesn't exist
        os.makedirs("audio", exist_ok=True)
        
        tts = gTTS(text=text, lang=lang, slow=False)
        filename = f"audio/{uuid.uuid4()}.mp3"
        
        # Save the audio file
        tts.save(filename)
        
        # Read the audio file and convert to base64
        with open(filename, "rb") as audio_file:
            audio_content = audio_file.read()
        
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        
        # Clean up the file
        os.remove(filename)
        
        return JSONResponse(content={"audio": audio_base64})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)