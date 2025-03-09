from fastapi import APIRouter, HTTPException, Form, Request
from fastapi.responses import JSONResponse
from googletrans import Translator
from gtts import gTTS
import uuid
import base64
import os
import io
import soundfile as sf
import sounddevice as sd

# Create a FastAPI router for your endpoints
router = APIRouter()

# Function to translate text to English (Tamil to English)
async def translate_text(text, source_lang="ta", target_lang="en"):
    try:
        translated = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
        return translated
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

# Endpoint for voice input in English
@router.post("/voice")
async def get_voice_input(request: Request):
    try:
        body = await request.json()
        recognized_text = body.get("text")
        if not recognized_text:
            raise HTTPException(status_code=400, detail="No text provided")
        return JSONResponse(content={"text": recognized_text})
    except HTTPException as e:
        raise e

# Endpoint for Tamil voice input and translation to English
@router.post("/tamil-voice")
async def tamil_voice_to_english(request: Request):
    try:
        body = await request.json()
        recognized_tamil = body.get("text")
        if not recognized_tamil:
            raise HTTPException(status_code=400, detail="No Tamil text provided")
        translated_english = await translate_text(recognized_tamil, source_lang="ta", target_lang="en")
        return JSONResponse(content={"recognized_tamil": recognized_tamil, "translated_english": translated_english})
    except HTTPException as e:
        raise e

# Function to translate English to Tamil
async def translate_to_tamil(text: str, source_lang="en", target_lang="ta"):
    try:
        translated = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
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

# Function to generate and play speech
async def speak_text(text, language="en"):
    try:
        tts = gTTS(text=text, lang=language)
        buffer = io.BytesIO()
        tts.write_to_fp(buffer)
        buffer.seek(0)
        data, samplerate = sf.read(buffer, dtype='float32')
        sd.play(data, samplerate)
        sd.wait()
    except Exception as e:
        print(f"Error in generating or playing speech: {e}")

# Endpoint to generate speech and return as base64
@router.post("/speak")
async def speak(text: str = Form(...), lang: str = Form("en")):
    try:
        tts = gTTS(text=text, lang=lang)
        filename = f"audio/{uuid.uuid4()}.mp3"
        tts.save(filename)
        with open(filename, "rb") as audio_file:
            audio_content = audio_file.read()
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        os.remove(filename)
        return JSONResponse(content={"audio": audio_base64})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
