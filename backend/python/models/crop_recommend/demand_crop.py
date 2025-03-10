from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
import os

# Define the router
router = APIRouter()

# Define the input data model
class DistrictRequest(BaseModel):
    district_name: str
current_dir = os.path.dirname(os.path.abspath(__file__))
# Load the dataset once at the start
file_path = os.path.join(current_dir, "ICRISAT-District Level Datas.csv")

df = pd.read_csv(file_path)

@router.post("/demand")
async def predict_crops(data: DistrictRequest):
    district_name = data.district_name.strip()

    # Filter the data for the selected district
    df_district = df[df['Dist Name'].str.upper() == district_name.upper()]

    if df_district.empty:
        raise HTTPException(status_code=400, detail=f"❌ District '{district_name}' not found. Please check the name and try again.")

    # Select production-related columns and year
    df_district = df_district.loc[:, ['Year'] + [col for col in df_district.columns if 'PRODUCTION' in col.upper()]]
    df_district = df_district.apply(pd.to_numeric, errors='coerce').fillna(0)
    df_district = df_district.groupby('Year', as_index=False).sum()
    df_district.set_index('Year', inplace=True)

    # Adjust window size dynamically based on available data
    window_size = min(5, len(df_district))
    df_ma = df_district.rolling(window=window_size).mean().dropna()

    if df_ma.empty:
        raise HTTPException(status_code=400, detail="❌ Not enough historical data to compute trends.")

    # Normalize the data
    scaler = MinMaxScaler()
    df_scaled = scaler.fit_transform(df_ma)

    # Prepare the data for LSTM model
    X, y = [], []
    time_steps = 5

    for i in range(len(df_scaled) - time_steps):
        X.append(df_scaled[i:i+time_steps])
        y.append(df_scaled[i+time_steps])

    X, y = np.array(X), np.array(y)

    # Train-Test Split
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # Define LSTM Model
    model = Sequential([
        LSTM(64, activation='relu', return_sequences=True, input_shape=(time_steps, X.shape[2])),
        Dropout(0.2),
        LSTM(64, activation='relu'),
        Dropout(0.2),
        Dense(X.shape[2])  # Output layer for all production columns
    ])

    model.compile(optimizer='adam', loss='mse')

    # Train Model
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    model.fit(X_train, y_train, epochs=100, batch_size=8, validation_data=(X_test, y_test), callbacks=[early_stopping])

    # Predict the next year's demand for crops
    last_five_years = df_scaled[-time_steps:]
    last_five_years = np.expand_dims(last_five_years, axis=0)
    predicted_values = model.predict(last_five_years)

    # Convert the prediction back to the original scale
    # Convert predicted values to native Python float and create response
    predicted_values = scaler.inverse_transform(predicted_values)[0]
    
    # Ensure all predicted values are converted to native Python float
    predicted_values = [float(value) for value in predicted_values]
    
    # Get top 5 demand-based crops
    top_5_indices = np.argsort(predicted_values)[-5:][::-1]  # Sort and get top 5
    top_5_crops = df_district.columns[top_5_indices]
    
    response = {
        "district": district_name,
        "top_5_crops": [
            {"rank": rank + 1, "crop": crop, "predicted_demand": predicted_values[top_5_indices[rank]]}
            for rank, crop in enumerate(top_5_crops)
        ]
    }
    
    return response
    
