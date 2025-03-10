# from fastapi import FastAPI, UploadFile, File, HTTPException,  APIRouter
# from tensorflow.keras.models import load_model
# from PIL import Image
# import numpy as np
# import io
# import os
# # Initialize FastAPI app
# app = FastAPI(
#     title="Plant Disease Prediction API",
#     description="Upload an image of a plant leaf to predict disease",
#     version="1.0.0"
# )
# router = APIRouter()
# current_dir = os.path.dirname(os.path.abspath(__file__))

# # Build absolute path for the .h5 model file
# model_path = os.path.join(current_dir, "Plant_Village_Detection_Model.h5")

# # Load the pre-trained model (loaded once when the app starts)
# try:
#     model = load_model(model_path)
#     print(f"Model loaded successfully from {model_path}")
# except Exception as e:
#     print(f"Failed to load model: {str(e)}")
#     raise
# # model = load_model("Plant_Village_Detection_Model.h5")
# # print("Model loaded successfully")

# def preprocess_image(image: Image.Image) -> np.ndarray:
#     # Resize image to the size expected by your model (e.g., 224x224)
#     image = image.resize((224, 224))  # Adjust size based on your model's training input
#     # Convert image to array
#     image_array = np.array(image)
#     # Normalize pixel values (assuming model was trained on 0-1 range)
#     image_array = image_array / 255.0
#     # Add batch dimension (model expects shape: (batch_size, height, width, channels))
#     image_array = np.expand_dims(image_array, axis=0)
#     return image_array

# # Prediction endpoint
# @router.post("/predict/")
# async def predict_plant_disease(file: UploadFile = File(...)):
#     try:
#         # Read the uploaded image file
#         contents = await file.read()
#         image = Image.open(io.BytesIO(contents)).convert("RGB")

#         # Preprocess the image
#         processed_image = preprocess_image(image)

#         # Make prediction
#         predictions = model.predict(processed_image)
        
#         # Assuming the model outputs a string (disease name) directly
#         predicted_disease = predictions[0]  # Adjust based on your model's output format
#         if isinstance(predicted_disease, np.ndarray):
#             # If the output is still an array, take the first element or handle accordingly
#             predicted_disease = predicted_disease.item() if predicted_disease.size == 1 else str(predicted_disease)

#         # Return the result
#         return {
#             "predicted_disease": predicted_disease,
#             "message": f"The plant appears to have {predicted_disease}"
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# # Root endpoint (optional)
# @app.get("/")
# async def root():
#     return {"message": "Welcome to the Plant Disease Prediction API. Use /predict/ to upload an image."}



from fastapi import FastAPI, UploadFile, File, HTTPException, APIRouter
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import os

# Define disease classes
DISEASE_CLASSES = [
    'Tomato__Late_blight', 'Tomato_healthy', 'Grape_healthy', 
    'Orange_Haunglongbing(Citrus_greening)', 'Soybean__healthy',
    'Squash_Powdery_mildew', 'Potato_healthy', 
    'Corn(maize)Northern_Leaf_Blight', 'Tomato_Early_blight',
    'Tomato_Septoria_leaf_spot', 
    'Corn(maize)Cercospora_leaf_spot Gray_leaf_spot',
    'Strawberry_Leaf_scorch', 'Peach_healthy', 'Apple_Apple_scab',
    'Tomato_Tomato_Yellow_Leaf_Curl_Virus', 'Tomato_Bacterial_spot',
    'Apple_Black_rot', 'Blueberry_healthy',
    'Cherry(including_sour)Powdery_mildew', 'Peach_Bacterial_spot',
    'Apple_Cedar_apple_rust', 'Tomato_Target_Spot',
    'Pepper,_bell_healthy', 'Grape_Leaf_blight(Isariopsis_Leaf_Spot)',
    'Potato__Late_blight', 'Tomato_Tomato_mosaic_virus',
    'Strawberry_healthy', 'Apple_healthy', 'Grape_Black_rot',
    'Potato_Early_blight', 'Cherry(including_sour)healthy',
    'Corn(maize)Common_rust', 'Grape__Esca(Black_Measles)',
    'Raspberry__healthy', 'Tomato_Leaf_Mold',
    'Tomato_Spider_mites Two-spotted_spider_mite',
    'Pepper,_bell_Bacterial_spot', 'Corn(maize)_healthy'
]

# Create router
router = APIRouter()

# Get current directory and model path
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "Plant_Village_Detection_Model.h5")

# Load the pre-trained model
try:
    model = load_model(model_path)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Failed to load model: {str(e)}")
    raise

def preprocess_image(image: Image.Image) -> np.ndarray:
    # Resize image to the size expected by your model (e.g., 224x224)
    image = image.resize((224, 224))  # Adjust size based on your model's training input
    # Convert image to array
    image_array = np.array(image)
    # Normalize pixel values (assuming model was trained on 0-1 range)
    image_array = image_array / 255.0
    # Add batch dimension (model expects shape: (batch_size, height, width, channels))
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def get_disease_prediction(predictions):
    """Convert model output to disease name and confidence"""
    predicted_class_idx = np.argmax(predictions)
    confidence = float(predictions[predicted_class_idx]) * 100
    disease_name = DISEASE_CLASSES[predicted_class_idx]
    return disease_name, confidence

@router.post("/predict/")
async def predict_plant_disease(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocess the image
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        disease_name, confidence = get_disease_prediction(predictions[0])
        
        # Format the disease name for display
        display_name = disease_name.replace('_', ' ').replace('__', ': ')
        
        return {
            "disease": disease_name,
            "display_name": display_name,
            "confidence": round(confidence, 2),
            "message": f"The plant appears to have {display_name} with {round(confidence, 2)}% confidence"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@router.get("/")
async def root():
    return {
        "message": "Welcome to the Plant Disease Prediction API",
        "endpoints": {
            "predict": "/predict/ (POST)",
            "supported_diseases": f"Supports {len(DISEASE_CLASSES)} different plant diseases"
        }
    }