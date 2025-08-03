from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import os
# Initialize router
router = APIRouter()

# Pydantic model for request body
class InputData(BaseModel):
    district: str
    season: str
current_dir = os.path.dirname(os.path.abspath(__file__))
# Load Dataset
file_path = os.path.join(current_dir, "apy.csv")
df = pd.read_csv(file_path)

# Clean data
df.columns = df.columns.str.strip()
df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)

@router.get("/districts")
async def get_available_districts():
    """Get list of available districts"""
    try:
        districts = sorted(df["District_Name"].unique().tolist())
        return {"districts": districts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching districts: {str(e)}")

@router.get("/seasons")
async def get_available_seasons():
    """Get list of available seasons"""
    try:
        seasons = sorted(df["Season"].unique().tolist())
        return {"seasons": seasons}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching seasons: {str(e)}")

@router.post("/seasonal_crop")
async def predict_crop(input_data: InputData):
    district = input_data.district.strip()
    season = input_data.season.strip()

    # Convert available districts and seasons to lowercase for case-insensitive comparison
    available_districts = [d.strip().lower() for d in df["District_Name"].unique()]
    available_seasons = [s.strip().lower() for s in df["Season"].unique()]

    # Check if the district and season exist in the dataset
    if district.lower() not in available_districts:
        raise HTTPException(status_code=400, detail=f"❌ District '{district}' not found!")
    if season.lower() not in available_seasons:
        raise HTTPException(status_code=400, detail=f"❌ Season '{season}' not found!")

    # Retrieve the original case-sensitive names
    original_district = df["District_Name"].unique()[available_districts.index(district.lower())]
    original_season = df["Season"].unique()[available_seasons.index(season.lower())]

    # Filter data for the given district and season
    df_district_season = df[(df["District_Name"] == original_district) &
                            (df["Season"] == original_season)]

    if df_district_season.empty:
        raise HTTPException(status_code=404, detail=f"❌ No data available for {original_district} in {original_season}")

    # Simple approach: Find the crop with highest average production
    df_avg = df_district_season.groupby("Crop", as_index=False)["Production"].mean()

    if df_avg.empty:
        raise HTTPException(status_code=404, detail=f"❌ No production data available for {original_district} in {original_season}")

    # Sort by production (highest first)
    df_avg = df_avg.sort_values("Production", ascending=False).reset_index(drop=True)

    # Get the top 5 crops (or fewer if not enough data)
    top_crops = df_avg.head(min(5, len(df_avg)))

    # Prepare the response
    crop_recommendations = []
    for i, row in enumerate(top_crops.itertuples()):
        # Convert any NumPy or pandas numeric types to Python float
        # and handle NaN values by replacing them with None
        production_value = float(row.Production) if not np.isnan(row.Production) else None

        crop_recommendations.append({
            "rank": i + 1,
            "crop": row.Crop,
            "average_production": production_value
        })

    # Build LSTM model for the top crop if we have enough data
    best_crop = df_avg.iloc[0]["Crop"]
    crop_data = df_district_season[df_district_season["Crop"] == best_crop]

    # Check if we have a time-based column to use for time series analysis
    time_column = None
    for col in crop_data.columns:
        if "year" in col.lower():
            time_column = col
            break

    # If we have a time column and enough data, try to build a prediction model
    prediction_note = "Recommendation based on historical average production."
    predicted_production = float(df_avg.iloc[0]["Production"]) if not np.isnan(df_avg.iloc[0]["Production"]) else None

    if time_column and len(crop_data) >= 5:
        try:
            # Sort by time
            crop_data = crop_data.sort_values(time_column)

            # Normalize production data
            scaler = MinMaxScaler()
            production_values = crop_data[["Production"]].values
            production_scaled = scaler.fit_transform(production_values)

            # Prepare data for LSTM
            X, y = [], []
            time_steps = 3

            for i in range(len(production_scaled) - time_steps):
                X.append(production_scaled[i:i+time_steps])
                y.append(production_scaled[i+time_steps])

            if len(X) > 0:
                X, y = np.array(X), np.array(y)

                # Build LSTM model
                model = Sequential([
                    LSTM(50, activation='relu', input_shape=(time_steps, 1), return_sequences=True),
                    Dropout(0.2),
                    LSTM(50, activation='relu'),
                    Dropout(0.2),
                    Dense(1)
                ])

                model.compile(optimizer='adam', loss='mse')

                # Train model
                model.fit(X, y, epochs=50, batch_size=1, verbose=0)

                # Make prediction
                last_sequence = production_scaled[-time_steps:]
                last_sequence = last_sequence.reshape((1, time_steps, 1))
                prediction = model.predict(last_sequence)
                predicted_production = scaler.inverse_transform(prediction)[0][0]
                prediction_note = "Prediction based on LSTM time series analysis."

        except Exception as e:
            print(f"LSTM prediction failed: {e}")
            # Fall back to average production
            predicted_production = float(df_avg.iloc[0]["Production"]) if not np.isnan(df_avg.iloc[0]["Production"]) else None

    return {
        "district": original_district,
        "season": original_season,
        "recommendations": crop_recommendations,
        "best_crop": {
            "name": best_crop,
            "predicted_production": predicted_production,
            "prediction_note": prediction_note
        }
    }
