import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import debounce from "lodash/debounce";
import { Toaster, toast } from "react-hot-toast";
import Step1PersonalInfo from "./FormSteps/Step1PersonalInfo";
import Step2LandInfo from "./FormSteps/Step2LandInfo";
import Step3SoilProperties from "./FormSteps/Step3SoilProperties";
import Step4Environmental from "./FormSteps/Step4Environmental";
import { DISTRICT_SOIL_MAP } from "./data/SoilData";
import { getLocationDataUtil } from "./utils/LocationUtils";

const FarmerRegistrationForm = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

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
          nitrogen: parseFloat(landInfo.soilProperties.nitrogen) || 0,
          phosphorous: parseFloat(landInfo.soilProperties.phosphorous) || 0,
          potassium: parseFloat(landInfo.soilProperties.potassium) || 0,
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
      toast.success("Registration successful!");
      navigate("/dashboard", { replace: true });
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
      setMessage("NPK values updated based on district and soil color");
    } else {
      setMessage(
        "No soil data available for the selected district and soil color"
      );
    }
  };

  const processSoilReport = async () => {
    if (!soilReport) {
      setMessage("Please upload a soil report first");
      return;
    }
    try {
      setIsLoading(true);
      setMessage("Processing soil report...");
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
        setMessage("Soil report processed successfully");
      } else {
        setMessage("Could not extract soil properties from the report");
      }
    } catch (error) {
      setMessage("Failed to process soil report. Please try manual entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide the following information to complete your
            registration
          </p>
        </div>
        {message && (
          <div className="rounded-md bg-blue-50 p-4">
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
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-8"
        >
          {step === 1 && (
            <Step1PersonalInfo
              farmerInfo={farmerInfo}
              setFarmerInfo={setFarmerInfo}
              setStep={setStep}
            />
          )}
          {step === 2 && (
            <Step2LandInfo
              landInfo={landInfo}
              setLandInfo={setLandInfo}
              setStep={setStep}
            />
          )}
          {step === 3 && (
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
          )}
          {step === 4 && (
            <Step4Environmental
              landInfo={landInfo}
              setLandInfo={setLandInfo}
              setStep={setStep}
              getLocationData={debouncedGetLocation}
            />
          )}
        </form>
        {isLoading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerRegistrationForm;
