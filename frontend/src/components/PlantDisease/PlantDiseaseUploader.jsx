import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaUpload,
  FaLeaf,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";

const PlantDiseaseUploader = () => {
  const [image, setImage] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please upload an image of the plant.");
      return;
    }
    setError("");
    setIsAnalyzing(true);

    // Simulate API call for diagnosis
    setTimeout(() => {
      // Mock response - in a real app, this would come from your backend
      const mockResult = {
        disease: "Leaf Blight",
        confidence: 87,
        description:
          "Leaf blight is characterized by irregular brown spots that eventually cause the leaf to wither and die.",
        treatment: [
          "Remove and destroy infected leaves",
          "Apply copper-based fungicide",
          "Ensure proper spacing between plants for airflow",
          "Avoid overhead watering to keep leaves dry",
        ],
        severity: "Moderate",
      };

      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetForm = () => {
    setImage(null);
    setPlantName("");
    setDescription("");
    setResult(null);
    setError("");
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "text-green-500";
      case "moderate":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <FaLeaf className="mr-2 text-green-500" />
        Plant Disease Diagnosis
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Plant Image <span className="text-red-500">*</span>
          </label>

          {image ? (
            <div className="relative mb-4">
              <img
                src={image}
                alt="Plant"
                className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={resetForm}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                onClick={triggerFileInput}
              >
                <FaUpload size={36} className="text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 text-center">
                  Click to upload from device
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: JPG, PNG, JPEG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                onClick={triggerCameraInput}
              >
                <FaCamera size={36} className="text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 text-center">
                  Click to use camera
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Take a clear photo of the affected area
                </p>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </motion.div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plant Name (Optional)
            </label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Tomato, Rice, Wheat"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Yellowing leaves, Brown spots"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!image || isAnalyzing}
            className={`py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center w-full md:w-auto ${
              !image || isAnalyzing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              "Diagnose Disease"
            )}
          </motion.button>
        </div>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 border-t pt-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-500" />
            Diagnosis Results
          </h3>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {result.disease}
                </p>
                {plantName && (
                  <p className="text-sm text-gray-600">Plant: {plantName}</p>
                )}
              </div>
              <div className="bg-gray-200 rounded-full px-3 py-1">
                <span className="font-medium">
                  {result.confidence}% Confidence
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">{result.description}</p>
            </div>

            <div className="mb-4">
              <p className="font-medium mb-2">
                Severity:
                <span className={`ml-2 ${getSeverityColor(result.severity)}`}>
                  {result.severity}
                </span>
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">Recommended Treatment:</p>
              <ul className="list-disc pl-5 space-y-1">
                {result.treatment.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Start New Diagnosis
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Save Results
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlantDiseaseUploader;
