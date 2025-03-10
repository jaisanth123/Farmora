import React from "react";
import { useNavigate } from "react-router-dom";
import { PiPlantFill, PiBugBeetleFill } from "react-icons/pi";
import { motion } from "framer-motion";

const DiagnosisHomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          Plant Health Diagnosis
        </h1>
        <p className="text-lg text-green-700">
          What would you like to check today?
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Disease Button Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => handleNavigation("/disease-diagnosis")}
          className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-green-200 hover:border-green-500 transition-all duration-300"
        >
          <div className="bg-green-600 p-4 flex justify-center">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <PiPlantFill className="text-white text-8xl" />
            </motion.div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Plant Disease Diagnosis
            </h2>
            <p className="text-gray-700 mb-4">
              Upload a photo of your plant leaves to identify possible diseases
              and get treatment recommendations.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
            >
              Diagnose Disease
            </motion.button>
          </div>
        </motion.div>

        {/* Pest Button Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => handleNavigation("/disease-pest")}
          className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border-2 border-orange-200 hover:border-orange-500 transition-all duration-300"
        >
          <div className="bg-orange-600 p-4 flex justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <PiBugBeetleFill className="text-white text-8xl" />
            </motion.div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-800 mb-3">
              Pest Identification
            </h2>
            <p className="text-gray-700 mb-4">
              Upload a photo of pests or pest damage to identify the invaders
              and get control measures.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
            >
              Identify Pests
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Farming tip section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-4xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500"
      >
        <h3 className="text-lg font-semibold text-blue-700">Farming Tip:</h3>
        <p className="text-gray-700">
          Regular monitoring of your crops is the best way to catch diseases and
          pests early. Try to check your plants at least once a week during the
          growing season.
        </p>
      </motion.div>
    </div>
  );
};

export default DiagnosisHomePage;
