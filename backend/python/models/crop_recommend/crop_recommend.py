import os
import pickle
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Set the correct path to the 'models' folder for the scaler and model files
scaler_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),  "minmax_scaler.pkl")
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "randomforest_model.pkl")

# Load the trained model and scaler
with open(scaler_path, "rb") as scaler_file:
    scaler = pickle.load(scaler_file)

with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

# Crop dictionary
crop_dict = {
    1: 'rice', 2: 'maize', 3: 'jute', 4: 'cotton', 5: 'coconut',
    6: 'papaya', 7: 'orange', 8: 'apple', 9: 'muskmelon', 10: 'watermelon',
    11: 'grapes', 12: 'mango', 13: 'banana', 14: 'pomegranate', 15: 'lentil',
    16: 'blackgram', 17: 'mungbean', 18: 'mothbeans', 19: 'pigeonpeas',
    20: 'kidneybeans', 21: 'chickpea', 22: 'coffee'
}

# Request body model
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    rainfall: float

# Create router
router = APIRouter()

@router.post("/recommend")
def recommend_crop(input_data: CropInput):
    try:
        features = np.array([[input_data.N, input_data.P, input_data.K, 
                              input_data.temperature, input_data.humidity, input_data.rainfall]])
        transformed_features = scaler.transform(features)
        
        # Get prediction probabilities
        probabilities = model.predict_proba(transformed_features)[0]
        
        # Get top 3 recommended crops
        top_indices = np.argsort(probabilities)[-3:][::-1]
        recommendations = [{"crop": crop_dict[idx + 1], "probability": round(probabilities[idx], 4)} for idx in top_indices]
        
        return {"recommendations": recommendations}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))