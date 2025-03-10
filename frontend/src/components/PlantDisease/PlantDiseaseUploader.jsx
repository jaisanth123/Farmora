import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaUpload,
  FaLeaf,
  FaInfoCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaSeedling,
  FaBookMedical,
  FaPrescriptionBottleAlt,
  FaClipboardList,
  FaSave,
  FaRedo,
  FaYoutube,
  FaFlask,
  FaShieldAlt,
} from "react-icons/fa";
import ChatbotWrapper from "../dashboard/utils/ChatbotWrapper";
const PlantDiseaseUploader = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // API endpoint
  const API_URL = "http://localhost:8000";

  const commonCrops = [
    "Rice",
    "Wheat",
    "Corn",
    "Potato",
    "Tomato",
    "Cotton",
    "Sugarcane",
    "Soybean",
    "Chickpea",
    "Millet",
    "Sorghum",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      setError("");
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please upload an image of the plant.");
      return;
    }
    setError("");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (plantName) {
        formData.append("plant_name", plantName);
      }

      const response = await fetch(`${API_URL}/api/predict_upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const prediction = await response.json();

      // Process chemical pesticides into array for line-by-line display
      const chemicalPesticidesArray = prediction.chemical_pesticides
        ? prediction.chemical_pesticides
            .split(/,\s*/)
            .filter((item) => item.trim())
        : ["No chemical treatment available"];

      // Format the prediction data to match the UI structure
      setResult({
        disease: prediction.prediction,
        confidence: Math.round(prediction.confidence * 100),
        description:
          prediction.pest_control_advice || "No description available",
        chemicalTreatments: chemicalPesticidesArray,
        organicRemedies:
          prediction.pest_control_advice || "No organic remedies available",
        severity:
          prediction.confidence > 0.8
            ? "High"
            : prediction.confidence > 0.5
            ? "Moderate"
            : "Low",
        impactOnYield:
          prediction.impact_on_yield ||
          "May reduce crop yield by 20-30% if left untreated.",
        spreadRate:
          prediction.spread_rate ||
          "Can spread to neighboring plants within 5-7 days.",
        references: [
          {
            title: "Agricultural Extension Services",
            url: `https://en.wikipedia.org/wiki/${prediction.prediction.replace(
              /\s+/g,
              "_"
            )}`,
          },
        ],
        videoLink: `https://www.youtube.com/results?search_query=how+to+control+${prediction.prediction.replace(
          /\s+/g,
          "+"
        )}+in+${plantName.replace(/\s+/g, "+")}`,
      });
    } catch (err) {
      setError("Error: " + err.message);
      console.error("Error during prediction:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const selectPresetCrop = (crop) => {
    setPlantName(crop);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current.click();
  };

  const resetForm = () => {
    setImage(null);
    setSelectedFile(null);
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
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-3 text-green-800 flex items-center">
          <FaLeaf className="mr-2 text-green-600" />
          Crop Disease Diagnosis Tool
        </h2>
        <p className="text-gray-600 mb-6">
          Identify plant diseases and get treatment recommendations for your
          crops
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Affected Plant Image{" "}
              <span className="text-red-500">*</span>
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
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
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
                    Upload from device
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Clear images help in accurate diagnosis
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
                    Capture with camera
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Focus on the affected part of the plant
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

            {error && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <FaExclamationTriangle className="mr-1" />
                {error}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Crop Type
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {commonCrops.map((crop) => (
                <motion.button
                  key={crop}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectPresetCrop(crop)}
                  className={`py-1 px-3 rounded-full text-sm ${
                    plantName === crop
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {crop}
                </motion.button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  placeholder="Or type another crop name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Symptoms (e.g., Yellow leaves, Spots)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!image || isAnalyzing}
              className={`py-3 px-8 rounded-lg text-white font-medium flex items-center justify-center ${
                !image || isAnalyzing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } shadow-md`}
            >
              {isAnalyzing ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Analyzing Crop...
                </>
              ) : (
                <>
                  <FaBookMedical className="mr-2" />
                  Diagnose Disease
                </>
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
            <h3 className="text-xl font-semibold mb-4 flex items-center text-green-800">
              <FaInfoCircle className="mr-2 text-green-600" />
              Diagnosis Results
            </h3>

            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-green-700 text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold">{result.disease}</p>
                    {plantName && (
                      <p className="text-sm opacity-90">Crop: {plantName}</p>
                    )}
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="font-medium text-green-700">
                      {result.confidence}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-3 mb-4">
                  <div
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getSeverityColor(
                      result.severity
                    )} bg-opacity-10 border border-current`}
                  >
                    Severity: {result.severity}
                  </div>
                  <a
                    href={`https://en.wikipedia.org/wiki/${result.disease.replace(
                      /\s+/g,
                      "_"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Learn More
                  </a>
                  <a
                    href={result.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-3 py-1 text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors flex items-center"
                  >
                    <FaYoutube className="mr-1" /> Video Tutorials
                  </a>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-500" />
                    Description
                  </h4>
                  <p className="text-gray-700 bg-white p-3 rounded-md border border-gray-100">
                    {description || "No description Provied by the user"}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaSeedling className="mr-2 text-green-500" />
                    Impact on Crop
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md border border-gray-100">
                      <p className="text-sm text-gray-800 mb-1 font-medium">
                        Yield Impact:
                      </p>
                      <p className="text-gray-700">{result.impactOnYield}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-gray-100">
                      <p className="text-sm text-gray-800 mb-1 font-medium">
                        Spread Rate:
                      </p>
                      <p className="text-gray-700">{result.spreadRate}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FaFlask className="mr-2 text-purple-500" />
                      Chemical Treatments
                    </h4>
                    <div className="bg-white rounded-md border border-gray-100">
                      <ul className="divide-y divide-gray-100">
                        {result.chemicalTreatments.map((item, index) => (
                          <li key={index} className="p-3 text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FaShieldAlt className="mr-2 text-green-500" />
                      Organic Remedies
                    </h4>
                    <div className="bg-white p-3 rounded-md border border-gray-100 h-full">
                      <p className="text-gray-700">{result.organicRemedies}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-between">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetForm}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <FaRedo className="mr-2" />
                    New Diagnosis
                  </motion.button>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center"
                      onClick={() => window.print()}
                    >
                      <FaClipboardList className="mr-2" />
                      Print Report
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Save Results
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <ChatbotWrapper
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        setIsChatOpen={setIsChatOpen}
      />
    </div>
  );
};

export default PlantDiseaseUploader;
