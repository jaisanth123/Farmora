import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatbotWrapper from "../dashboard/utils/ChatbotWrapper";

import {
  FaSeedling,
  FaCloudRain,
  FaTemperatureHigh,
  FaTint,
  FaLeaf,
  FaSun,
  FaHistory,
  FaDownload,
  FaInfoCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  GiCorn,
  GiWheat,
  GiFarmTractor,
  GiPlantSeed,
  GiSprout,
  GiGrainBundle,
} from "react-icons/gi";
import { WiHumidity } from "react-icons/wi";
import { BsArrowRepeat } from "react-icons/bs";

function CropRecommendationForm() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    N: 0,
    P: 0,
    K: 0,
    temperature: 0,
    humidity: 0,
    rainfall: 0,
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recommendationHistory, setRecommendationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [tooltips, setTooltips] = useState({});
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      const token = await currentUser.getIdToken();

      try {
        const response = await fetch(
          `http://localhost:5000/api/farmer/data/${currentUser.uid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        setFormData({
          N: data.landInfo?.soilProperties.nitrogen || 0,
          P: data.landInfo?.soilProperties.phosphorous || 0,
          K: data.landInfo?.soilProperties.potassium || 0,
          temperature: data.landInfo?.environmentalConditions?.temperature || 0,
          humidity: data.landInfo?.environmentalConditions?.humidity || 0,
          rainfall: data.landInfo?.environmentalConditions?.rainfall || 0,
        });

        // Fetch recommendation history if available
        if (data.recommendationHistory) {
          setRecommendationHistory(data.recommendationHistory);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Could not load your farm data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = parseFloat(value);

    // Define the max values for each parameter
    const maxValues = {
      N: 200,
      P: 100,
      K: 100,
      temperature: 50,
      humidity: 100,
      rainfall: 300,
    };

    // Ensure value is not below 0 or above the max for that input
    if (!isNaN(parsedValue)) {
      parsedValue = Math.max(0, Math.min(parsedValue, maxValues[name]));

      setFormData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    }
  };

  const showTooltip = (name) => {
    setTooltips({ ...tooltips, [name]: true });
    setTimeout(() => {
      setTooltips({ ...tooltips, [name]: false });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = await currentUser.getIdToken();

    try {
      const response = await fetch(
        `http://localhost:5000/api/farmer/data/${currentUser.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            soilProperties: {
              nitrogen: formData.N,
              phosphorous: formData.P,
              potassium: formData.K,
            },
            environmentalConditions: {
              temperature: formData.temperature,
              humidity: formData.humidity,
              rainfall: formData.rainfall,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update farm data");
      }

      const updatedFarmerData = await response.json();
      console.log("Farm data updated successfully:", updatedFarmerData);
      toast.success("Your farm data has been updated successfully!");
    } catch (error) {
      console.error("Error updating farm data:", error);
      toast.error("Error updating user data: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const token = await currentUser.getIdToken();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations || []);

        // Add to history with timestamp
        const historyEntry = {
          date: new Date().toISOString(),
          conditions: { ...formData },
          recommendations: data.recommendations,
        };

        const updatedHistory = [historyEntry, ...recommendationHistory].slice(
          0,
          10
        ); // Keep last 10
        setRecommendationHistory(updatedHistory);

        // Optionally save history to backend
        saveRecommendationHistory(updatedHistory);

        toast.success("Crop recommendations generated!");
      } else {
        toast.warning(
          "No suitable crop recommendations found for these conditions."
        );
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to generate crop recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecommendationHistory = async (history) => {
    if (!currentUser) return;

    const token = await currentUser.getIdToken();

    try {
      await fetch(
        `http://localhost:5000/api/farmer/recommendation-history/${currentUser.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recommendationHistory: history }),
        }
      );
    } catch (error) {
      console.error("Error saving recommendation history:", error);
    }
  };

  const downloadRecommendations = () => {
    if (!recommendations.length) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `crop-recommendations-${timestamp}.json`;

    const data = {
      generated: new Date().toISOString(),
      farmConditions: formData,
      recommendations: recommendations,
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.info("Recommendations downloaded!");
  };

  const loadHistoricalRecommendation = (historyItem) => {
    setFormData(historyItem.conditions);
    setRecommendations(historyItem.recommendations);
    setShowHistory(false);
    toast.info("Historical farm conditions and recommendations loaded");
  };

  if (isLoading && !formData.N) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="flex items-center justify-center w-24 h-24 mb-4">
          <div className="animate-spin">
            <FaLeaf className="text-6xl text-green-500" />
          </div>
        </div>
        <p className="text-xl text-green-800">Loading your farm data...</p>
      </div>
    );
  }

  // Determine nitrogen level class (for progress bar coloring)
  const getNitrogenClass = (value) => {
    if (value < 50) return "bg-red-500";
    if (value < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Determine phosphorus level class
  const getPhosphorusClass = (value) => {
    if (value < 20) return "bg-red-500";
    if (value < 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Determine potassium level class
  const getPotassiumClass = (value) => {
    if (value < 30) return "bg-red-500";
    if (value < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // CSS animation for growing plant
  const growingPlantStyle = {
    animation: "grow 2s ease-in-out infinite alternate",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8">
      <style jsx>{`
        @keyframes grow {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes shine {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
        .animate-grow {
          animation: grow 2s ease-in-out infinite alternate;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .tooltip {
          position: absolute;
          right: 10px;
          top: -30px;
          background-color: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip.show {
          opacity: 1;
        }
        /* For number inputs */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-green-200">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center">
            <GiFarmTractor className="text-5xl text-green-600 mr-4" />
            <h1 className="text-3xl font-bold text-green-800">
              Crop Recommendation Tool
            </h1>
          </div>
          <p className="text-green-600 mt-2">
            Find the best crops for your farm based on soil and climate
            conditions
          </p>
        </div>

        {/* History Toggle Button */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-full transition-colors duration-200"
          >
            <FaHistory className="mr-1" />
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>

        {/* Recommendation History Panel */}
        {showHistory && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Recommendation History
            </h2>

            {recommendationHistory.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recommendationHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded border border-gray-200 hover:border-green-400 cursor-pointer transition-all duration-200"
                    onClick={() => loadHistoricalRecommendation(item)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {formatDate(item.date)}
                      </span>
                      <span className="text-xs text-gray-500">
                        N: {item.conditions.N}, P: {item.conditions.P}, K:{" "}
                        {item.conditions.K}, Temp: {item.conditions.temperature}
                        °C
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Top recommendation: {item.recommendations[0].crop} (
                      {(item.recommendations[0].probability * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recommendation history found
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="transition-all duration-300 hover:shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <GiPlantSeed className="mr-2 text-2xl" /> Farm Conditions
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Soil Properties Group */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-medium text-green-700 mb-3 flex items-center">
                  <FaSeedling className="mr-2 text-green-600" /> Soil Properties
                </h3>

                {/* Nitrogen */}
                <div className="mb-4 transition-all duration-300 hover:bg-green-100 p-2 rounded-md">
                  <label
                    htmlFor="N"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FaSeedling className="text-green-600 mr-2" />
                    Nitrogen (N) Level
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-blue-500"
                      onClick={() => showTooltip("nitrogen")}
                    >
                      <FaInfoCircle />
                    </button>
                    <div
                      className={`tooltip ${tooltips.nitrogen ? "show" : ""}`}
                    >
                      Recommended range: 50-150 kg/ha
                    </div>
                  </label>

                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      id="N"
                      name="N"
                      min="0"
                      max="200"
                      value={formData.N}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="ml-3 relative">
                      <input
                        type="number"
                        name="N"
                        value={formData.N}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="200"
                        className="bg-white w-20 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500">kg/ha</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full ${getNitrogenClass(
                        formData.N
                      )} transition-all duration-300`}
                      style={{
                        width: `${Math.min((formData.N / 200) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Optimal</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Phosphorus */}
                <div className="mb-4 transition-all duration-300 hover:bg-green-100 p-2 rounded-md">
                  <label
                    htmlFor="P"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FaSeedling className="text-blue-600 mr-2" />
                    Phosphorus (P) Level
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-blue-500"
                      onClick={() => showTooltip("phosphorus")}
                    >
                      <FaInfoCircle />
                    </button>
                    <div
                      className={`tooltip ${tooltips.phosphorus ? "show" : ""}`}
                    >
                      Recommended range: 20-60 kg/ha
                    </div>
                  </label>

                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      id="P"
                      name="P"
                      min="0"
                      max="100"
                      value={formData.P}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="ml-3 relative">
                      <input
                        type="number"
                        name="P"
                        value={formData.P}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="100"
                        className="bg-white w-20 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500">kg/ha</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full ${getPhosphorusClass(
                        formData.P
                      )} transition-all duration-300`}
                      style={{
                        width: `${Math.min((formData.P / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Optimal</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Potassium */}
                <div className="transition-all duration-300 hover:bg-green-100 p-2 rounded-md">
                  <label
                    htmlFor="K"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FaSeedling className="text-purple-600 mr-2" />
                    Potassium (K) Level
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-blue-500"
                      onClick={() => showTooltip("potassium")}
                    >
                      <FaInfoCircle />
                    </button>
                    <div
                      className={`tooltip ${tooltips.potassium ? "show" : ""}`}
                    >
                      Recommended range: 30-80 kg/ha
                    </div>
                  </label>

                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      id="K"
                      name="K"
                      min="0"
                      max="100"
                      value={formData.K}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="ml-3 relative">
                      <input
                        type="number"
                        name="K"
                        value={formData.K}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="100"
                        className="bg-white w-20 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500">kg/ha</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full ${getPotassiumClass(
                        formData.K
                      )} transition-all duration-300`}
                      style={{
                        width: `${Math.min((formData.K / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Optimal</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Environmental Conditions Group */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-medium text-blue-700 mb-3 flex items-center">
                  <FaCloudRain className="mr-2 text-blue-600" /> Environmental
                  Conditions
                </h3>

                {/* Temperature */}
                <div className="mb-4 transition-all duration-300 hover:bg-blue-100 p-2 rounded-md">
                  <label
                    htmlFor="temperature"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FaTemperatureHigh className="text-red-500 mr-2" />
                    Temperature (°C)
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      id="temperature"
                      name="temperature"
                      min="0"
                      max="50"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="ml-3 relative">
                      <input
                        type="number"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="50"
                        className="bg-white w-20 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500">°C</span>
                    </div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="mb-4 transition-all duration-300 hover:bg-blue-100 p-2 rounded-md">
                  <label
                    htmlFor="humidity"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <WiHumidity className="text-blue-500 text-xl mr-1" />
                    Humidity (%)
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      id="humidity"
                      name="humidity"
                      min="0"
                      max="100"
                      value={formData.humidity}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="ml-3 relative">
                      <input
                        type="number"
                        name="humidity"
                        value={formData.humidity}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="100"
                        className="bg-white w-20 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500">%</span>
                    </div>
                  </div>
                </div>

                {/* Rainfall */}
                <div className="transition-all duration-300 hover:bg-blue-100 p-2 rounded-md">
                  <label
                    htmlFor="rainfall"
                    className="block text-sm font-medium text-gray-700 flex items-center"
                  >
                    <FaCloudRain className="text-blue-600 mr-2" />
                    Rainfall (mm)
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="range"
                      id="rainfall"
                      name="rainfall"
                      min="0"
                      max="300"
                      value={formData.rainfall}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="ml-3 relative">
                      <input
                        type="number"
                        name="rainfall"
                        value={formData.rainfall}
                        onChange={handleNumberInputChange}
                        min="0"
                        max="300"
                        className="bg-white w-20 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="ml-1 text-xs text-gray-500">mm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70 transition-all duration-200 flex justify-center items-center"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Farm Conditions"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="transition-all duration-300 hover:shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <GiWheat className="mr-2 text-2xl" /> Crop Recommendations
            </h2>

            <div className="text-center mb-8 bg-green-50 p-4 rounded-lg">
              {/* Farm illustration using icons instead of Lottie */}
              <div className="relative h-32 w-full max-w-md mx-auto">
                <div className="absolute top-0 right-1/4 animate-shine">
                  <FaSun className="text-4xl text-yellow-400" />
                </div>
                <div className="absolute bottom-0 left-1/4 animate-grow">
                  <GiSprout className="text-4xl text-green-500" />
                </div>
                <div
                  className="absolute bottom-0 left-1/2 animate-grow"
                  style={{ animationDelay: "0.5s" }}
                >
                  <GiCorn className="text-4xl text-green-600" />
                </div>
                <div
                  className="absolute bottom-0 right-1/4 animate-grow"
                  style={{ animationDelay: "1s" }}
                >
                  <GiWheat className="text-4xl text-yellow-600" />
                </div>
                <div className="absolute top-1/2 right-1/3 animate-float">
                  <FaCloudRain className="text-2xl text-blue-400" />
                </div>
              </div>
            </div>

            <form onSubmit={handleRecommendationSubmit} className="mb-6">
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-md shadow-sm hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-70 transition-all duration-200 flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <GiCorn className="mr-2 text-xl" />
                      Get Crop Recommendations
                    </>
                  )}
                </button>
              </div>
            </form>
            {recommendations.length > 0 ? (
              <div className="bg-green-50 p-5 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-md mt-5">
                <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
                  <GiGrainBundle className="mr-2 text-green-600" />
                  Recommended Crops
                </h3>
                <div className="grid grid-cols-1">
                  {recommendations.map((crop, index) => (
                    <a
                      href={`https://en.wikipedia.org/wiki/${crop.crop.replace(
                        /\s+/g,
                        "_"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={index}
                      className="flex items-center mb-5 bg-white p-3 rounded-lg border border-green-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-green-300 hover:bg-green-50 cursor-pointer"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <GiWheat className="text-green-600 text-xl" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800">
                          {crop.crop}
                        </h4>
                      </div>
                      <div>
                        <FaExternalLinkAlt className="text-green-600 text-xl" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-5 rounded-lg border border-green-200 text-center mt-5">
                <div className="flex justify-center mb-3">
                  <div className="animate-bounce-slow">
                    <GiPlantSeed className="text-5xl text-green-300" />
                  </div>
                </div>
                <p className="text-green-700">
                  Click the button above to get personalized crop
                  recommendations based on your farm conditions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ChatbotWrapper
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        setIsChatOpen={setIsChatOpen}
      />
      ;
    </div>
  );
}

export default CropRecommendationForm;
