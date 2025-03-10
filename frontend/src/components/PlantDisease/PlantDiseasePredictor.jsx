import React, { useState } from 'react';
import axios from 'axios';

const PlantDiseasePredictor = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPrediction(null); // Reset prediction when a new file is selected
      setError(null); // Reset error
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to predict disease. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">Plant Disease Predictor</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Upload an image of a plant leaf to predict its disease.
          </p>
        </div>

        {/* File Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="plantImage"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="plantImage"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="mt-2 text-sm text-gray-600">
                {file ? file.name : 'Upload Plant Image'}
              </span>
              <span className="mt-1 text-xs text-gray-500">JPG, JPEG, or PNG</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || isLoading}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Predicting...' : 'Predict Disease'}
          </button>
        </form>

        {/* Display Prediction or Error */}
        {prediction && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              <strong>Predicted Disease:</strong> {prediction.predicted_disease}
            </p>
            <p className="mt-1 text-sm text-green-700">{prediction.message}</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDiseasePredictor;