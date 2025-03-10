import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import debounce from "lodash/debounce";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaUser,
  FaMapMarkerAlt,
  FaFlask,
  FaCloudSun,
  FaUpload,
  FaArrowRight,
  FaArrowLeft,
  FaSeedling,
  FaCheck,
} from "react-icons/fa";
import {
  GiCottonFlower,
  GiPlantRoots,
  GiWheat,
  GiFarmTractor,
  GiSprout,
  GiGrain,
  GiPlantsAndAnimals,
} from "react-icons/gi";
import { WiHumidity, WiRaindrops, WiThermometer } from "react-icons/wi";

import { MdOutlineWaterDrop } from "react-icons/md";
import confetti from "canvas-confetti";
import { DISTRICT_SOIL_MAP } from "./data/SoilData";
import { getLocationDataUtil } from "./utils/LocationUtils";

// Step components with improved UI
import Step1PersonalInfo from "./FormSteps/Step1PersonalInfo";
import Step2LandInfo from "./FormSteps/Step2LandInfo";
import Step3SoilProperties from "./FormSteps/Step3SoilProperties";
import Step4Environmental from "./FormSteps/Step4Environmental";

const FarmerRegistrationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const [farmerInfo, setFarmerInfo] = useState({
    name: "",
    age: "",
    state: "",
    district: "",
  });

  const [landInfo, setLandInfo] = useState({
    district: "",
    state: "",
    crops: [],
    location: { type: "Point", coordinates: [0, 0] },
    soilProperties: {
      soilColor: "",
      nitrogen: "",
      phosphorous: "",
      potassium: "",
      pH: "",
    },
    environmentalConditions: { temperature: "", humidity: "", rainfall: "" },
  });

  const [soilReport, setSoilReport] = useState(null);
  const [reportUploadOption, setReportUploadOption] = useState("manual");

  const debouncedGetLocation = useCallback(
    debounce(() => {
      if (landInfo.district && landInfo.state) {
        getLocationDataUtil(landInfo, setLandInfo, setMessage, setIsLoading);
      }
    }, 1000),
    [landInfo.district, landInfo.state]
  );

  useEffect(() => {
    if (location.state && location.state.userId)
      setUserId(location.state.userId);
    else if (currentUser) setUserId(currentUser.uid);
    else navigate("/login");
  }, [location.state, currentUser, navigate]);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/farmers/profile/${userId}`
          );
          if (response.data && !response.data.error)
            navigate("/dashboard", { replace: true });
        } catch (error) {
          if (error.response && error.response.status !== 404)
            console.error("Error checking user registration:", error);
        }
      }
    };
    checkUserRegistration();
  }, [userId, navigate]);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  useEffect(() => {
    // Update progress based on current step
    setProgress(step * 25);
  }, [step]);

  const runConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !farmerInfo.name ||
      !farmerInfo.age ||
      !farmerInfo.state ||
      !farmerInfo.district
    ) {
      toast.error("Please fill in all personal information fields");
      setIsLoading(false);
      return;
    }

    if (!landInfo.district || !landInfo.state) {
      toast.error("Please fill in all land information fields");
      setIsLoading(false);
      return;
    }

    const farmerData = {
      userId,
      personalInfo: { ...farmerInfo, age: parseInt(farmerInfo.age) },
      landInfo: {
        ...landInfo,
        soilProperties: {
          ...landInfo.soilProperties,
          nitrogen: parseFloat(landInfo.soilProperties.N) || 0,
          phosphorous: parseFloat(landInfo.soilProperties.P) || 0,
          potassium: parseFloat(landInfo.soilProperties.K) || 0,
          pH: parseFloat(landInfo.soilProperties.pH) || 0,
        },
        environmentalConditions: {
          temperature:
            parseFloat(landInfo.environmentalConditions.temperature) || 0,
          humidity: parseFloat(landInfo.environmentalConditions.humidity) || 0,
          rainfall: parseFloat(landInfo.environmentalConditions.rainfall) || 0,
        },
      },
    };

    try {
      await axios.post(
        "http://localhost:5000/api/farmer/register",
        farmerData,
        { headers: { "Content-Type": "application/json" } }
      );

      setShowSuccessAnimation(true);
      runConfetti();

      setTimeout(() => {
        toast.success("Registration successful!");
        navigate("/dashboard", { replace: true });
      }, 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  const getNPKValues = () => {
    const district = landInfo.district;
    const soilColorInput = landInfo.soilProperties.soilColor;
    const normalizedSoilColor =
      DISTRICT_SOIL_MAP.soil_color_map[soilColorInput] || soilColorInput;

    if (DISTRICT_SOIL_MAP.district_soil_map[district]?.[normalizedSoilColor]) {
      const soilData =
        DISTRICT_SOIL_MAP.district_soil_map[district][normalizedSoilColor];
      setLandInfo({
        ...landInfo,
        soilProperties: { ...landInfo.soilProperties, ...soilData },
      });

      toast.success("NPK values updated based on district and soil color");
    } else {
      toast.error(
        "No soil data available for the selected district and soil color"
      );
    }
  };

  const processSoilReport = async () => {
    if (!soilReport) {
      toast.error("Please upload a soil report first");
      return;
    }
    try {
      setIsLoading(true);
      toast.loading("Processing soil report...");

      const formData = new FormData();
      formData.append("file", soilReport);

      const response = await axios.post("/api/process-soil-report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.soilProperties) {
        setLandInfo({
          ...landInfo,
          soilProperties: response.data.soilProperties,
        });
        toast.success("Soil report processed successfully");
      } else {
        toast.error("Could not extract soil properties from the report");
      }
    } catch (error) {
      toast.error("Failed to process soil report. Please try manual entry.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animated icon for loading
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 mb-4"
      >
        <GiSprout className="w-full h-full text-green-500" />
      </motion.div>
      <p className="text-green-700 font-medium">
        Processing your information...
      </p>
    </div>
  );

  // Animated farm scene component - replacing Lottie
  const FarmAnimation = () => (
    <div className="relative h-48 w-full overflow-hidden bg-green-50 rounded-lg">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100 to-blue-300"></div>

      {/* Sun */}
      <motion.div
        className="absolute top-4 right-8 w-10 h-10 rounded-full bg-yellow-400"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-green-700"></div>

      {/* Plants */}
      <div className="absolute flex justify-around bottom-16 left-4 right-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center"
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            <GiSprout className="text-green-500 w-8 h-8" />
            <div className="h-4 w-1 bg-green-800"></div>
          </motion.div>
        ))}
      </div>

      {/* Tractor */}
      <motion.div
        className="absolute bottom-20 left-0"
        animate={{ x: [-50, 250] }}
        transition={{ repeat: Infinity, duration: 8, repeatType: "reverse" }}
      >
        <GiFarmTractor className="text-red-600 w-12 h-12" />
      </motion.div>

      {/* Clouds */}
      {[1, 2].map((i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute top-8 w-16 h-6 bg-white rounded-full"
          style={{ left: `${i * 30}%` }}
          animate={{ x: [0, 40, 0] }}
          transition={{
            repeat: Infinity,
            duration: 10 + i * 5,
            ease: "linear",
            delay: i * 2,
          }}
        >
          <div className="absolute top-0 left-3 w-6 h-6 bg-white rounded-full"></div>
          <div className="absolute top-0 right-3 w-8 h-8 bg-white rounded-full"></div>
        </motion.div>
      ))}
    </div>
  );

  // Success animation component - replacing Lottie
  const SuccessAnimation = () => (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <FaCheck className="w-12 h-12 text-green-600" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-green-600">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mt-2 text-center">
          Redirecting to your dashboard...
        </p>
      </motion.div>

      {/* Animated plants */}
      <div className="flex justify-center mt-6 space-x-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.2, duration: 0.5 }}
          >
            <GiPlantRoots className={`w-10 h-10 text-green-${400 + i * 100}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[
          "Personal Info",
          "Land Details",
          "Soil Properties",
          "Environmental",
        ].map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${
                step > index + 1
                  ? "bg-green-500"
                  : step === index + 1
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            >
              {index === 0 && <FaUser className="text-white" size={20} />}
              {index === 1 && (
                <FaMapMarkerAlt className="text-white" size={20} />
              )}
              {index === 2 && <FaSeedling className="text-white" size={20} />}
              {index === 3 && <FaCloudSun className="text-white" size={20} />}
            </motion.div>
            <span
              className={`text-xs ${
                step === index + 1
                  ? "font-bold text-green-600"
                  : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-green-600 h-2.5 rounded-full"
          initial={{ width: `${(step - 1) * 25}%` }}
          animate={{ width: `${step * 25}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <GiFarmTractor className="text-green-600" size={60} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center">
            <FaSeedling className="text-green-500 mr-2" />
            Farmora Registration
            <FaSeedling className="text-green-500 ml-2" />
          </h1>
          <p className="mt-2 text-center text-lg text-gray-600">
            Join our smart farming community and unlock the potential of your
            land
          </p>
        </div>

        {showSuccessAnimation ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 text-center"
          >
            <SuccessAnimation />
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white shadow-xl rounded-xl overflow-hidden"
          >
            <div className="bg-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <GiWheat className="mr-2" /> Complete Your Profile
                </h2>
                <div className="text-sm bg-white text-green-600 rounded-full px-3 py-1 font-medium">
                  Step {step} of 4
                </div>
              </div>
            </div>

            <div className="p-6">
              <StepIndicator />

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-blue-50 p-4 mb-6"
                >
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-3 text-sm text-blue-700">{message}</p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Step1PersonalInfo
                            farmerInfo={farmerInfo}
                            setFarmerInfo={setFarmerInfo}
                            setStep={setStep}
                          />
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Step2LandInfo
                            landInfo={landInfo}
                            setLandInfo={setLandInfo}
                            setStep={setStep}
                          />
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Step3SoilProperties
                            landInfo={landInfo}
                            setLandInfo={setLandInfo}
                            setStep={setStep}
                            reportUploadOption={reportUploadOption}
                            setReportUploadOption={setReportUploadOption}
                            soilReport={soilReport}
                            setSoilReport={setSoilReport}
                            processSoilReport={processSoilReport}
                            getNPKValues={getNPKValues}
                          />
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Step4Environmental
                            landInfo={landInfo}
                            setLandInfo={setLandInfo}
                            setStep={setStep}
                            getLocationData={debouncedGetLocation}
                            handleSubmit={handleSubmit}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>

                <div className="md:col-span-2 flex flex-col justify-center">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <FarmAnimation />

                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-green-700 flex items-center">
                        <GiCottonFlower className="mr-2" />
                        Why Join Farmora?
                      </h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <FaLeaf className="mt-1 mr-2 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Smart crop recommendations based on your soil
                          </span>
                        </li>
                        <li className="flex items-start">
                          <MdOutlineWaterDrop className="mt-1 mr-2 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Precision irrigation guidance
                          </span>
                        </li>
                        <li className="flex items-start">
                          <GiPlantRoots className="mt-1 mr-2 text-green-500" />
                          <span className="text-sm text-gray-600">
                            AI-powered pest and disease alerts
                          </span>
                        </li>
                        <li className="flex items-start">
                          <WiRaindrops className="mt-1 mr-2 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Weather forecasts tailored to your location
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <LoadingSpinner />
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerRegistrationForm;
