import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaCamera,
  FaUpload,
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
  FaArrowLeft,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-6 flex items-center text-green-700 hover:text-green-900 font-medium"
      >
        <Link to="/disease" className="flex items-center">
          <FaArrowLeft className="mr-1" /> Back to Diagnosis Options
        </Link>
      </motion.button>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <FaLeaf className="text-green-600 text-6xl" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-green-800">
            Crop Disease Diagnosis Tool
          </h1>
          <p className="mt-3 text-green-700">
            Identify plant diseases and get treatment recommendations for your
            crops
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Upload Affected Plant Image{" "}
                <span className="text-red-500">*</span>
              </label>

              {image ? (
                <div className="relative mb-4">
                  <div className="relative inline-block">
                    <img
                      src={image}
                      alt="Plant"
                      className="max-h-64 max-w-full rounded-lg shadow-md"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={resetForm}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    {selectedFile?.name} (
                    {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center transition-all hover:border-green-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                      onClick={triggerFileInput}
                    >
                      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaUpload className="h-10 w-10 text-green-600" />
                      </div>
                      <span className="text-md font-medium text-green-700">
                        Upload from device
                      </span>
                      <span className="mt-2 text-sm text-gray-500">
                        Clear images help in accurate diagnosis
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                      onClick={triggerCameraInput}
                    >
                      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaCamera className="h-10 w-10 text-green-600" />
                      </div>
                      <span className="text-md font-medium text-green-700">
                        Capture with camera
                      </span>
                      <span className="mt-2 text-sm text-gray-500">
                        Focus on the affected part of the plant
                      </span>
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
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 rounded-lg bg-red-50 p-3 border border-red-200 flex items-start"
                >
                  <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
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
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="bg-green-600 p-4 text-white">
              <div className="flex items-center">
                <FaInfoCircle className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold">Diagnosis Results</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Identified Condition:
                  </h3>
                  <p className="text-2xl font-bold text-green-700">
                    {result.disease}
                  </p>
                  {plantName && (
                    <p className="text-sm text-gray-600">Crop: {plantName}</p>
                  )}
                </div>
                <div className="bg-green-100 text-green-800 rounded-full px-4 py-2">
                  <span className="font-medium">
                    {result.confidence}% Confidence
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
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

              {description && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-500" />
                    Symptoms Description
                  </h4>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-100">
                    {description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <FaSeedling className="mr-2 text-green-500" />
                  Impact on Crop
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Yield Impact:
                    </p>
                    <p className="text-gray-700">{result.impactOnYield}</p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Spread Rate:
                    </p>
                    <p className="text-gray-700">{result.spreadRate}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaFlask className="mr-2 text-purple-500" />
                    Chemical Treatments
                  </h4>
                  <div className="bg-white rounded-md border border-gray-200 shadow-sm">
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
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm h-full">
                    <p className="text-gray-700">{result.organicRemedies}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800">
                  Important Note:
                </h3>
                <p className="text-sm text-blue-700">
                  This is an AI-assisted diagnosis. For confirmation and
                  specific treatment advice, consider consulting with your local
                  agricultural extension office.
                </p>
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
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8 border-l-4 border-yellow-400"
        >
          <h3 className="text-lg font-medium text-yellow-700 mb-2">
            Tips for Best Results:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>
                Take clear, well-lit photos showing both healthy and affected
                areas
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>
                Include multiple leaves if the symptoms vary across the plant
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>
                For difficult cases, consider taking photos at different times
                of day
              </span>
            </li>
          </ul>
        </motion.div>
      </div>

      <ChatbotWrapper
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        setIsChatOpen={setIsChatOpen}
      />
    </motion.div>
  );
};

export default PlantDiseaseUploader;
