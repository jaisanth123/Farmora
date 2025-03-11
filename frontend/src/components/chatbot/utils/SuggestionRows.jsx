import React, { useRef, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaArrowLeft,
  FaSeedling,
  FaChartLine,
  FaFlask,
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
  FaLeaf,
  FaChartBar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// List of districts (simplified from your second file)
const indianDistricts = [
  "Ariyalur",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kancheepuram",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Salem",
  "Thanjavur",
  "Tiruppur",
  // Add more as needed
];

// Seasons with icons
const indianSeasons = [
  { name: "Monsoon", period: "June to October (Monsoon)" },
  { name: "Winter", period: "October to March (Winter)" },
  { name: "Summer", period: "March to June (Summer)" },
  { name: "Whole Year", period: "Whole Year" },
];

const SuggestionRows = ({ handleSend, toggleSuggestions }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showFeatureButtons, setShowFeatureButtons] = useState(false);
  const [showSeasonalForm, setShowSeasonalForm] = useState(false);
  const [showSoilForm, setShowSoilForm] = useState(false);
  const [showDemandForm, setShowDemandForm] = useState(false);
  const [district, setDistrict] = useState("");
  const [season, setSeason] = useState("");
  const [demandDistrict, setDemandDistrict] = useState("");
  const [soilParams, setSoilParams] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });
  const suggestionRowRef1 = useRef(null);
  const suggestionRowRef2 = useRef(null);

  // Example suggestions
  const suggestions = [
    { id: 1, text: "Crop recommendations" },
    { id: 2, text: "Disease Diagnosis" },
    { id: 3, text: "What will be the weather today?" },
    { id: 4, text: "What fertilizers can we use for Paddy" },
    { id: 5, text: "How to improve the yield?" },
    { id: 6, text: "Best plant to grow at summer in Erode" },
    { id: 7, text: "Pest control advice" },
    { id: 8, text: "What is the price of tomato" },
  ];

  // Feature buttons data
  const featureButtons = [
    {
      id: 1,
      title: "Seasonal Prediction",
      icon: <FaSeedling />,
      bgColor: "bg-green-500",
    },
    {
      id: 2,
      title: "Demand Analysis",
      icon: <FaChartLine />,
      bgColor: "bg-blue-500",
    },
    {
      id: 3,
      title: "Soil Analysis",
      icon: <FaFlask />,
      bgColor: "bg-yellow-500",
    },
  ];

  // Split suggestions into two rows
  const firstRowSuggestions = suggestions.slice(0, 4);
  const secondRowSuggestions = suggestions.slice(4);

  // Handle suggestion click
  const handleSuggestionClick = (text) => {
    if (text === "Crop recommendations") {
      setShowFeatureButtons(true);
    } else {
      handleSend(text);
      toggleSuggestions();
    }
  };

  const handleFeatureButtonClick = (feature) => {
    if (feature.title === "Seasonal Prediction") {
      setShowSeasonalForm(true);
      setShowSoilForm(false);
      setShowDemandForm(false);
      setShowFeatureButtons(false);
    } else if (feature.title === "Soil Analysis") {
      setShowSoilForm(true);
      setShowSeasonalForm(false);
      setShowDemandForm(false);
      setShowFeatureButtons(false);
    } else if (feature.title === "Demand Analysis") {
      setShowDemandForm(true);
      setShowSoilForm(false);
      setShowSeasonalForm(false);
      setShowFeatureButtons(false);
    } else {
      handleSend(`I want to explore ${feature.title}`);
      setShowFeatureButtons(false);
      toggleSuggestions();
    }
  };

  const handleSeasonalSubmit = (e) => {
    e.preventDefault();
    handleSend(
      `I want seasonal crop recommendations for ${district} during ${season} season.`
    );
    setShowSeasonalForm(false);
    toggleSuggestions();
  };

  const handleSoilSubmit = (e) => {
    e.preventDefault();
    handleSend(
      `I want crop recommendations based on soil analysis: N:${soilParams.nitrogen}, P:${soilParams.phosphorous}, K:${soilParams.potassium}, Temperature:${soilParams.temperature}°C, Humidity:${soilParams.humidity}%, Rainfall:${soilParams.rainfall}mm`
    );
    setShowSoilForm(false);
    toggleSuggestions();
  };

  const handleDemandSubmit = (e) => {
    e.preventDefault();
    handleSend(
      `I want to analyze crop demand and market trends in ${demandDistrict} district.`
    );
    setShowDemandForm(false);
    toggleSuggestions();
  };

  const handleInputChange = (e, param) => {
    if (param) {
      setSoilParams({
        ...soilParams,
        [param]: e.target.value,
      });
    }
  };

  const scrollRight = () => {
    const scrollAmount = 150;
    if (suggestionRowRef1.current) {
      suggestionRowRef1.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    if (suggestionRowRef2.current) {
      suggestionRowRef2.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    setScrollPosition(scrollPosition + scrollAmount);
  };

  const scrollLeft = () => {
    const scrollAmount = -150;
    if (suggestionRowRef1.current) {
      suggestionRowRef1.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    if (suggestionRowRef2.current) {
      suggestionRowRef2.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    setScrollPosition(Math.max(0, scrollPosition + scrollAmount));
  };

  // Check if scrolling is possible
  useEffect(() => {
    const checkScrollability = () => {
      if (suggestionRowRef1.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          suggestionRowRef1.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    // Initial check
    checkScrollability();

    // Add event listener
    const row1 = suggestionRowRef1.current;

    if (row1) row1.addEventListener("scroll", checkScrollability);

    return () => {
      if (row1) row1.removeEventListener("scroll", checkScrollability);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const formFieldVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <div className="w-full bg-white shadow-md">
      {!showFeatureButtons &&
      !showSeasonalForm &&
      !showSoilForm &&
      !showDemandForm ? (
        <div className="py-3 relative">
          {/* First row of suggestions */}
          <div
            ref={suggestionRowRef1}
            className="px-4 mb-2 flex gap-2 overflow-x-hidden whitespace-nowrap hide-scrollbar"
          >
            {firstRowSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="px-3 py-1 bg-black text-white text-sm border border-gray-600 rounded-full whitespace-nowrap hover:bg-gray-800 transition-colors"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                {suggestion.text}
              </button>
            ))}
          </div>

          {/* Second row of suggestions */}
          <div
            ref={suggestionRowRef2}
            className="px-4 flex gap-2 overflow-x-hidden whitespace-nowrap hide-scrollbar"
          >
            {secondRowSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="px-3 py-1 bg-black text-white text-sm border border-gray-600 rounded-full whitespace-nowrap hover:bg-gray-800 transition-colors"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                {suggestion.text}
              </button>
            ))}
          </div>

          {/* Navigation arrows */}
          {canScrollRight && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                onClick={scrollRight}
                className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                aria-label="Scroll right"
              >
                <FaArrowRight className="text-black" />
              </button>
            </div>
          )}

          {canScrollLeft && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <button
                onClick={scrollLeft}
                className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                aria-label="Scroll left"
              >
                <FaArrowLeft className="text-black" />
              </button>
            </div>
          )}
        </div>
      ) : showFeatureButtons ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 py-4"
        >
          <div className="grid grid-cols-3 gap-4 w-full">
            {featureButtons.map((feature) => (
              <motion.button
                key={feature.id}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`${feature.bgColor} py-3 px-2 rounded-lg flex flex-col items-center justify-center shadow-md hover:opacity-90 transition-opacity text-center`}
                onClick={() => handleFeatureButtonClick(feature)}
              >
                <span className="text-white mb-1">{feature.icon}</span>
                <span className="text-white font-medium text-sm">
                  {feature.title}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition-colors"
              onClick={() => setShowFeatureButtons(false)}
            >
              Back
            </motion.button>
          </div>
        </motion.div>
      ) : showSeasonalForm ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4"
        >
          <h3 className="text-lg font-medium text-green-700 mb-4 flex items-center">
            <FaSeedling className="mr-2 text-green-600" />
            Seasonal Crop Recommendation
          </h3>

          <form onSubmit={handleSeasonalSubmit} className="space-y-4">
            <motion.div variants={formFieldVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select District
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              >
                <option value="">Select a district</option>
                {indianDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={formFieldVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Season
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                required
              >
                <option value="">Select a season</option>
                {indianSeasons.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.period})
                  </option>
                ))}
              </select>
            </motion.div>

            <div className="flex space-x-3">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition shadow-md"
              >
                Get Recommendations
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                className="bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition"
                onClick={() => {
                  setShowSeasonalForm(false);
                  setShowFeatureButtons(true);
                }}
              >
                Back
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : showSoilForm ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4"
        >
          <h3 className="text-lg font-medium text-yellow-700 mb-4 flex items-center">
            <FaFlask className="mr-2 text-yellow-600" />
            Soil Analysis
          </h3>

          <form onSubmit={handleSoilSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={formFieldVariants} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLeaf className="mr-1 text-green-600" />
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  placeholder="mg/kg"
                  value={soilParams.nitrogen}
                  onChange={(e) => handleInputChange(e, "nitrogen")}
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLeaf className="mr-1 text-blue-600" />
                  Phosphorous (P)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  placeholder="mg/kg"
                  value={soilParams.phosphorous}
                  onChange={(e) => handleInputChange(e, "phosphorous")}
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaLeaf className="mr-1 text-purple-600" />
                  Potassium (K)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  placeholder="mg/kg"
                  value={soilParams.potassium}
                  onChange={(e) => handleInputChange(e, "potassium")}
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaTemperatureHigh className="mr-1 text-red-600" />
                  Temperature
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  placeholder="°C"
                  value={soilParams.temperature}
                  onChange={(e) => handleInputChange(e, "temperature")}
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaTint className="mr-1 text-blue-600" />
                  Humidity
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  placeholder="%"
                  value={soilParams.humidity}
                  onChange={(e) => handleInputChange(e, "humidity")}
                  required
                />
              </motion.div>

              <motion.div variants={formFieldVariants} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCloudRain className="mr-1 text-blue-600" />
                  Rainfall
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  placeholder="mm"
                  value={soilParams.rainfall}
                  onChange={(e) => handleInputChange(e, "rainfall")}
                  required
                />
              </motion.div>
            </div>

            <div className="flex space-x-3 mt-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition shadow-md"
              >
                Get Recommendations
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                className="bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition"
                onClick={() => {
                  setShowSoilForm(false);
                  setShowFeatureButtons(true);
                }}
              >
                Back
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : showDemandForm ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4"
        >
          <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center">
            <FaChartBar className="mr-2 text-blue-600" />
            Crop Demand Analysis
          </h3>

          <form onSubmit={handleDemandSubmit} className="space-y-4">
            <motion.div variants={formFieldVariants} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaMapMarkerAlt className="mr-1 text-red-600" />
                Select District
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={demandDistrict}
                onChange={(e) => setDemandDistrict(e.target.value)}
                required
              >
                <option value="">Select a district</option>
                {indianDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </motion.div>

            <div className="flex space-x-3 mt-6">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition shadow-md"
              >
                Analyze Market Demand
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                className="bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition"
                onClick={() => {
                  setShowDemandForm(false);
                  setShowFeatureButtons(true);
                }}
              >
                Back
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : null}
    </div>
  );
};

export default SuggestionRows;
