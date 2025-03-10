import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaFlask,
  FaVial,
  FaWater,
  FaUpload,
  FaSeedling,
  FaPen,
} from "react-icons/fa";
import { HiColorSwatch } from "react-icons/hi";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { DISTRICT_SOIL_MAP } from "../data/SoilData";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "react-lottie";
//import farmingAnimation from "../animations/farming-animation.json"; // You'll need to create or download this animation
import { Tooltip } from "react-tooltip";

// Custom styled components
const SectionTitle = ({ children }) => (
  <motion.h2
    className="text-2xl font-semibold text-green-800 mb-4 border-b-2 border-green-500 pb-2"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.h2>
);

const GreenButton = ({ onClick, disabled, children, icon, className = "" }) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
  >
    {icon}
    {children}
  </motion.button>
);

const Step3SoilProperties = ({
  landInfo,
  setLandInfo,
  setStep,
  reportUploadOption,
  setReportUploadOption,
  soilReport,
  setSoilReport,
  processSoilReport,
  getNPKValues,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [soilColors, setSoilColors] = useState([]);

  useEffect(() => {
    // Transform soil colors for react-select
    const colors = Object.keys(DISTRICT_SOIL_MAP.soil_color_map).map(
      (color) => ({
        value: color,
        label: color.charAt(0).toUpperCase() + color.slice(1),
      })
    );
    setSoilColors(colors);
  }, []);

  // Handle changes to nested soilProperties fields
  const handleLandInfoChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");

    // Map input field names to the expected keys from DISTRICT_SOIL_MAP
    const keyMap = {
      nitrogen: "N",
      phosphorous: "P",
      potassium: "K",
      pH: "pH",
      soilColor: "soilColor",
    };

    const mappedChild = keyMap[child] || child;

    setLandInfo((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [mappedChild]: value,
      },
    }));
  };

  // Handle react-select change
  const handleSelectChange = (selectedOption, { name }) => {
    const [parent, child] = name.split(".");

    setLandInfo((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: selectedOption.value,
      },
    }));
  };

  // Handle file upload for soil report
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSoilReport(file);
    toast.success(`File "${file.name}" uploaded successfully!`);
  };

  // Handle NPK value fetching with loading state
  const handleGetNPKValues = async () => {
    setIsLoading(true);
    try {
      await getNPKValues();
    } catch (error) {
      toast.error("Failed to fetch NPK values. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation options for Lottie
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: farmingAnimation,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <SectionTitle>
          <div className="flex items-center gap-2">
            <FaSeedling className="text-green-600" />
            Soil Properties Analysis
          </div>
        </SectionTitle>
        {/* <div className="w-24 h-24">
          <Lottie options={defaultOptions} />
        </div> */}
      </div>

      <motion.div
        className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md space-y-6 border border-green-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Radio buttons for input method */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 bg-white p-4 rounded-lg shadow-sm">
          <motion.label
            className="inline-flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="radio"
              name="reportUploadOption"
              value="manual"
              checked={reportUploadOption === "manual"}
              onChange={() => setReportUploadOption("manual")}
              className="form-radio h-5 w-5 text-green-600"
            />
            <span className="ml-2 text-gray-700 flex items-center gap-2">
              <FaPen className="text-green-600" />
              <span>Enter soil details manually</span>
            </span>
          </motion.label>
          <motion.label
            className="inline-flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="radio"
              name="reportUploadOption"
              value="upload"
              checked={reportUploadOption === "upload"}
              onChange={() => setReportUploadOption("upload")}
              className="form-radio h-5 w-5 text-green-600"
            />
            <span className="ml-2 text-gray-700 flex items-center gap-2">
              <FaUpload className="text-green-600" />
              <span>Upload soil report</span>
            </span>
          </motion.label>
        </div>

        {/* Conditional rendering based on reportUploadOption */}
        <motion.div
          key={reportUploadOption}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {reportUploadOption === "manual" ? (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label
                  htmlFor="soilColor"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <HiColorSwatch className="text-green-600" />
                  Soil Color
                </label>
                <Select
                  id="soilColor"
                  name="soilProperties.soilColor"
                  options={soilColors}
                  value={
                    soilColors.find(
                      (option) =>
                        option.value === landInfo.soilProperties.soilColor
                    ) || ""
                  }
                  onChange={(option) =>
                    handleSelectChange(option, {
                      name: "soilProperties.soilColor",
                    })
                  }
                  className="mt-1 block w-full"
                  placeholder="Select Soil Color"
                  isSearchable
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: "#22c55e",
                      primary25: "#dcfce7",
                    },
                  })}
                />
              </div>

              <GreenButton
                onClick={handleGetNPKValues}
                disabled={
                  !landInfo.district ||
                  !landInfo.soilProperties.soilColor ||
                  isLoading
                }
                icon={<FaFlask />}
                className="w-full"
              >
                {isLoading ? "Fetching NPK Values..." : "Get NPK Values"}
              </GreenButton>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  className="bg-white p-4 rounded-lg shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    htmlFor="nitrogen"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                    data-tooltip-id="nitrogen-tooltip"
                    data-tooltip-content="Nitrogen is essential for leaf growth and green vegetation"
                  >
                    <FaLeaf className="text-green-600" />
                    Nitrogen (N)
                  </label>
                  <Tooltip id="nitrogen-tooltip" />
                  <div className="relative">
                    <input
                      type="number"
                      id="nitrogen"
                      name="soilProperties.nitrogen"
                      value={
                        landInfo.soilProperties.N ||
                        landInfo.soilProperties.nitrogen ||
                        ""
                      }
                      onChange={handleLandInfoChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">N</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-4 rounded-lg shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    htmlFor="phosphorous"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                    data-tooltip-id="phosphorous-tooltip"
                    data-tooltip-content="Phosphorous aids in root development and flowering"
                  >
                    <FaFlask className="text-green-600" />
                    Phosphorous (P)
                  </label>
                  <Tooltip id="phosphorous-tooltip" />
                  <div className="relative">
                    <input
                      type="number"
                      id="phosphorous"
                      name="soilProperties.phosphorous"
                      value={
                        landInfo.soilProperties.P ||
                        landInfo.soilProperties.phosphorous ||
                        ""
                      }
                      onChange={handleLandInfoChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">P</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-4 rounded-lg shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    htmlFor="potassium"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                    data-tooltip-id="potassium-tooltip"
                    data-tooltip-content="Potassium improves overall plant health and disease resistance"
                  >
                    <FaVial className="text-green-600" />
                    Potassium (K)
                  </label>
                  <Tooltip id="potassium-tooltip" />
                  <div className="relative">
                    <input
                      type="number"
                      id="potassium"
                      name="soilProperties.potassium"
                      value={
                        landInfo.soilProperties.K ||
                        landInfo.soilProperties.potassium ||
                        ""
                      }
                      onChange={handleLandInfoChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">K</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-4 rounded-lg shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    htmlFor="pH"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                    data-tooltip-id="ph-tooltip"
                    data-tooltip-content="pH affects nutrient availability to plants (6.0-7.0 is ideal for most crops)"
                  >
                    <FaWater className="text-green-600" />
                    pH Level
                  </label>
                  <Tooltip id="ph-tooltip" />
                  <div className="relative">
                    <input
                      type="number"
                      id="pH"
                      name="soilProperties.pH"
                      value={landInfo.soilProperties.pH || ""}
                      onChange={handleLandInfoChange}
                      step="0.1"
                      min="0"
                      max="14"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">pH</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div
                className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-white shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <input
                    type="file"
                    id="soilReport"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="soilReport"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-green-50 p-6 rounded-full"
                    >
                      <FaUpload className="h-12 w-12 text-green-500" />
                    </motion.div>
                    <span className="mt-4 text-sm font-medium text-gray-700">
                      {soilReport ? soilReport.name : "Upload Soil Report"}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      PDF, JPG, JPEG, or PNG (Max 10MB)
                    </span>
                    <motion.span
                      className="mt-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-block"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      Click or drag file here
                    </motion.span>
                  </label>
                </div>
              </motion.div>
              <GreenButton
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    processSoilReport();
                    setIsLoading(false);
                    toast.success("Soil report processed successfully!");
                  }, 1500);
                }}
                disabled={!soilReport || isLoading}
                icon={<FaFlask />}
                className="w-full"
              >
                {isLoading ? "Processing Report..." : "Process Report"}
              </GreenButton>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Help section */}
      <motion.div
        className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Did you know?
        </h3>
        <p className="text-xs text-blue-700">
          Optimal soil nutrient levels vary by crop. For example, rice typically
          requires a pH of 5.5-6.5, while wheat grows best in slightly alkaline
          soils with a pH of 6.5-7.5.
        </p>
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        className="flex justify-between mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button
          type="button"
          onClick={() => setStep(2)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
        >
          <IoMdArrowBack />
          Previous
        </motion.button>
        <motion.button
          type="button"
          onClick={() => {
            setStep(4);
            toast.info("Moving to next step!");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
        >
          Next
          <IoMdArrowForward />
        </motion.button>
      </motion.div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </motion.div>
  );
};

export default Step3SoilProperties;
