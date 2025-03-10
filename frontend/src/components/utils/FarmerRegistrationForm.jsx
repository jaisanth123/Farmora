import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import debounce from "lodash/debounce";
import { Toaster, toast } from "react-hot-toast";

// District-soil color mapping data
const DISTRICT_SOIL_MAP = {
  district_soil_map: {
    Kancheepuram: {
      Red: { N: 35, P: 25, K: 65, pH: 6.2 },
      Clay: { N: 60, P: 40, K: 95, pH: 6.8 },
      Coastal: { N: 30, P: 20, K: 110, pH: 8.0 },
    },
    Tiruvallur: {
      Red: { N: 35, P: 25, K: 65, pH: 6.2 },
      Clay: { N: 60, P: 40, K: 95, pH: 6.8 },
      Coastal: { N: 30, P: 20, K: 110, pH: 8.0 },
    },
    Cuddalore: {
      Red: { N: 35, P: 25, K: 65, pH: 6.2 },
      Clay: { N: 60, P: 40, K: 95, pH: 6.8 },
      Coastal: { N: 30, P: 20, K: 110, pH: 8.0 },
    },
    Vellore: {
      Red: { N: 35, P: 25, K: 65, pH: 6.2 },
      Clay: { N: 60, P: 40, K: 95, pH: 6.8 },
    },
    Villupuram: {
      Red: { N: 35, P: 25, K: 65, pH: 6.2 },
      Clay: { N: 60, P: 40, K: 95, pH: 6.8 },
    },
    Tiruvannamalai: {
      Red: { N: 35, P: 25, K: 65, pH: 6.2 },
      Clay: { N: 60, P: 40, K: 95, pH: 6.8 },
    },
    Dharmapuri: {
      Red: { N: 30, P: 20, K: 55, pH: 6.0 },
      Brown: { N: 40, P: 25, K: 75, pH: 6.5 },
      Black: { N: 60, P: 35, K: 115, pH: 8.0 },
    },
    Krishnagiri: {
      Red: { N: 30, P: 20, K: 55, pH: 6.0 },
      Brown: { N: 40, P: 25, K: 75, pH: 6.5 },
      Black: { N: 60, P: 35, K: 115, pH: 8.0 },
    },
    Salem: {
      Red: { N: 30, P: 20, K: 55, pH: 6.0 },
      Brown: { N: 40, P: 25, K: 75, pH: 6.5 },
      Black: { N: 60, P: 35, K: 115, pH: 8.0 },
    },
    Namakkal: {
      Red: { N: 30, P: 20, K: 55, pH: 6.0 },
      Brown: { N: 40, P: 25, K: 75, pH: 6.5 },
      Black: { N: 60, P: 35, K: 115, pH: 8.0 },
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
    },
    Erode: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Coimbatore: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Tiruppur: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Theni: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Karur: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Dindigul: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Perambalur: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Ariyalur: {
      Loamy: { N: 45, P: 22, K: 80, pH: 6.4 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
    },
    Thanjavur: {
      Loamy: { N: 55, P: 40, K: 90, pH: 6.6 },
      Alluvium: { N: 75, P: 50, K: 115, pH: 7.0 },
    },
    Nagapattinam: {
      Loamy: { N: 55, P: 40, K: 90, pH: 6.6 },
      Alluvium: { N: 75, P: 50, K: 115, pH: 7.0 },
    },
    Tiruvarur: {
      Loamy: { N: 55, P: 40, K: 90, pH: 6.6 },
      Alluvium: { N: 75, P: 50, K: 115, pH: 7.0 },
    },
    Trichy: {
      Loamy: { N: 55, P: 40, K: 90, pH: 6.6 },
      Alluvium: { N: 75, P: 50, K: 115, pH: 7.0 },
    },
    Pudukkottai: {
      Loamy: { N: 55, P: 40, K: 90, pH: 6.6 },
      Alluvium: { N: 75, P: 50, K: 115, pH: 7.0 },
    },
    Madurai: {
      Coastal: { N: 40, P: 22, K: 110, pH: 7.5 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
      Sandy: { N: 30, P: 18, K: 55, pH: 6.2 },
      "Deep Red": { N: 35, P: 22, K: 75, pH: 6.5 },
    },
    Sivagangai: {
      Coastal: { N: 40, P: 22, K: 110, pH: 7.5 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
      Sandy: { N: 30, P: 18, K: 55, pH: 6.2 },
      "Deep Red": { N: 35, P: 22, K: 75, pH: 6.5 },
    },
    Ramanathapuram: {
      Coastal: { N: 40, P: 22, K: 110, pH: 7.5 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
      Sandy: { N: 30, P: 18, K: 55, pH: 6.2 },
      "Deep Red": { N: 35, P: 22, K: 75, pH: 6.5 },
    },
    Virudhunagar: {
      Coastal: { N: 40, P: 22, K: 110, pH: 7.5 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
      Sandy: { N: 30, P: 18, K: 55, pH: 6.2 },
      "Deep Red": { N: 35, P: 22, K: 75, pH: 6.5 },
    },
    Tirunelveli: {
      Coastal: { N: 40, P: 22, K: 110, pH: 7.5 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
      Sandy: { N: 30, P: 18, K: 55, pH: 6.2 },
      "Deep Red": { N: 35, P: 22, K: 75, pH: 6.5 },
    },
    Thoothukudi: {
      Coastal: { N: 40, P: 22, K: 110, pH: 7.5 },
      Black: { N: 60, P: 30, K: 115, pH: 7.7 },
      Sandy: { N: 30, P: 18, K: 55, pH: 6.2 },
      "Deep Red": { N: 35, P: 22, K: 75, pH: 6.5 },
    },
    Kanyakumari: {
      Coastal: { N: 30, P: 20, K: 110, pH: 8.0 },
      "Deep Red": { N: 60, P: 25, K: 75, pH: 6.0 },
    },
    "The Nilgiris": {
      Lateritic: { N: 25, P: 15, K: 40, pH: 5.0 },
    },
    Kodaikanal: {
      Lateritic: { N: 25, P: 15, K: 40, pH: 5.0 },
    },
  },
  //loamy
  soil_color_map: {
    "Red Sandy Loam": "Red",
    Red: "Red",
    "Clay Loam": "Clay",
    Clay: "Clay",
    "Saline Coastal Alluvium": "Coastal",
    "Coastal Alluvium": "Coastal",
    "Non-Calcareous Red": "Red",
    "Non-Calcareous Brown": "Brown",
    "Calcareous Black": "Black",
    Black: "Black",
    "Red Loamy": "Loamy",
    Alluvium: "Alluvium",
    "Red Sandy Soil": "Sandy",
    "Deep Red Soil": "Deep Red",
    "Deep Red Loam": "Deep Red",
    Lateritic: "Lateritic",
  },
};

const FarmerRegistrationForm = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // Multi-step form

  // Farmer personal info
  const [farmerInfo, setFarmerInfo] = useState({
    name: "",
    age: "",
    state: "",
    district: "",
  });

  // Land details
  const [landInfo, setLandInfo] = useState({
    district: "",
    state: "",
    crops: [],
    location: {
      type: "Point",
      coordinates: [0, 0], // [longitude, latitude]
    },
    soilProperties: {
      soilColor: "",
      nitrogen: "",
      phosphorous: "",
      potassium: "",
      pH: "",
    },
    environmentalConditions: {
      temperature: "",
      humidity: "",
      rainfall: "",
    },
  });

  // For soil report upload
  const [soilReport, setSoilReport] = useState(null);
  const [reportUploadOption, setReportUploadOption] = useState("manual"); // 'manual' or 'upload'

  // Debounced version of getLocationData
  const debouncedGetLocation = useCallback(
    debounce(async () => {
      if (landInfo.district && landInfo.state) {
        await getLocationData();
      }
    }, 1000), // Wait 1 second after last keystroke
    [landInfo.district, landInfo.state]
  );

  // Get userId from location state
  useEffect(() => {
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
    } else if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      navigate("/login");
    }
  }, [location.state, currentUser, navigate]);

  // Check if user already registered
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (userId) {
        try {
          // Update the endpoint to match your backend
          const response = await axios.get(
            `http://localhost:5000/api/farmers/profile/${userId}`
          );

          if (response.data && !response.data.error) {
            // User already registered, redirect to dashboard
            navigate("/dashboard", { replace: true });
          }
        } catch (error) {
          // If 404, user not registered yet, which is fine
          if (error.response && error.response.status !== 404) {
            console.error("Error checking user registration:", error);
          }
        }
      }
    };

    checkUserRegistration();
  }, [userId, navigate]);

  // Add this effect to check authentication
  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
  }, [currentUser, navigate]);

  // Handle input changes for farmer info
  const handleFarmerInfoChange = (e) => {
    const { name, value } = e.target;
    setFarmerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for land info
  const handleLandInfoChange = async (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setLandInfo((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setLandInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // If district or state changes, trigger debounced location fetch
    if (name === "district" || name === "state") {
      debouncedGetLocation();
    }
  };

  // Handle crop input (array)
  const handleCropChange = (index, value) => {
    const updatedCrops = [...landInfo.crops];
    updatedCrops[index] = value;
    setLandInfo({
      ...landInfo,
      crops: updatedCrops,
    });
  };

  // Add a new crop input field
  const addCropField = () => {
    setLandInfo({
      ...landInfo,
      crops: [...landInfo.crops, ""],
    });
  };

  // Remove a crop input field
  const removeCropField = (index) => {
    const updatedCrops = [...landInfo.crops];
    updatedCrops.splice(index, 1);
    setLandInfo({
      ...landInfo,
      crops: updatedCrops,
    });
  };

  // Handle soil report file upload
  const handleFileUpload = (e) => {
    setSoilReport(e.target.files[0]);
  };

  // Get NPK values based on district and soil color
  const getNPKValues = () => {
    const district = landInfo.district;
    const soilColorInput = landInfo.soilProperties.soilColor;

    // Normalize soil color using the mapping
    const normalizedSoilColor =
      DISTRICT_SOIL_MAP.soil_color_map[soilColorInput] || soilColorInput;

    if (
      DISTRICT_SOIL_MAP.district_soil_map[district] &&
      DISTRICT_SOIL_MAP.district_soil_map[district][normalizedSoilColor]
    ) {
      const soilData =
        DISTRICT_SOIL_MAP.district_soil_map[district][normalizedSoilColor];
      setLandInfo({
        ...landInfo,
        soilProperties: {
          nitrogen: soilData.N,
          phosphorous: soilData.P,
          potassium: soilData.K,
          pH: soilData.pH,
        },
      });
      setMessage("NPK values updated based on district and soil color");
    } else {
      setMessage(
        "No soil data available for the selected district and soil color"
      );
    }
  };

  // Get coordinates and environmental data
  const getLocationData = async () => {
    try {
      setIsLoading(true);
      setMessage("Fetching location and weather data...");

      // First get coordinates
      const placeQuery = `${landInfo.district}, ${landInfo.state}, India`;
      console.log("Fetching coordinates for:", placeQuery);

      const coordResponse = await axios.get(
        `http://localhost:8000/api/coordinates?place=${encodeURIComponent(
          placeQuery
        )}`
      );

      console.log("Coordinates response:", coordResponse.data);

      if (coordResponse.data.error) {
        throw new Error(coordResponse.data.error);
      }

      const { latitude, longitude } = coordResponse.data;

      // Then get weather data
      console.log("Fetching weather data for:", latitude, longitude);

      const weatherResponse = await axios.get(
        `http://localhost:8000/api/environmental_conditions?latitude=${latitude}&longitude=${longitude}`
      );

      console.log("Weather response:", weatherResponse.data);

      if (weatherResponse.data.error) {
        throw new Error(weatherResponse.data.error);
      }

      // Update form state with the received data
      setLandInfo((prev) => ({
        ...prev,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        environmentalConditions: {
          temperature: weatherResponse.data.temperature || "",
          humidity: weatherResponse.data.humidity || "",
          rainfall: weatherResponse.data.rainfall || "",
        },
      }));

      setMessage("Location and weather data updated successfully!");
    } catch (error) {
      console.error("Error fetching location and weather data:", error);
      setMessage(
        error.message ||
          "Failed to fetch location and weather data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Process soil report using OCR
  const processSoilReport = async () => {
    if (!soilReport) {
      setMessage("Please upload a soil report first");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Processing soil report...");

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", soilReport);

      // Send to your OCR API endpoint
      const response = await axios.post("/api/process-soil-report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.soilProperties) {
        setLandInfo({
          ...landInfo,
          soilProperties: response.data.soilProperties,
        });
        setMessage("Soil report processed successfully");
      } else {
        setMessage("Could not extract soil properties from the report");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing soil report:", error);
      setMessage("Failed to process soil report. Please try manual entry.");
      setIsLoading(false);
    }
  };

  // Submit the form to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Log the current state values
    console.log("Current state values:", {
      farmerInfo,
      landInfo,
      userId,
    });

    // Validate required fields
    if (
      !farmerInfo.name ||
      !farmerInfo.age ||
      !farmerInfo.state ||
      !farmerInfo.district
    ) {
      toast.error("Please fill in all personal information fields");
      return;
    }

    if (!landInfo.district || !landInfo.state) {
      toast.error("Please fill in all land information fields");
      return;
    }

    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    const farmerData = {
      userId: userId, // Ensure it's at the top level
      personalInfo: {
        // Nest farmerInfo inside personalInfo
        name: farmerInfo.name,
        age: parseInt(farmerInfo.age), // Ensure age is a number
        state: farmerInfo.state,
        district: farmerInfo.district,
      },
      landInfo: {
        // Land details remain unchanged
        district: landInfo.district,
        state: landInfo.state,
        crops: landInfo.crops || [],
        location: landInfo.location || { type: "Point", coordinates: [0, 0] },
        soilProperties: {
          soilColor: landInfo.soilProperties?.soilColor || "",
          nitrogen: landInfo.soilProperties?.nitrogen || 0,
          phosphorous: landInfo.soilProperties?.phosphorous || 0,
          potassium: landInfo.soilProperties?.potassium || 0,
          pH: landInfo.soilProperties?.pH || 0,
        },
        environmentalConditions: {
          temperature: landInfo.environmentalConditions?.temperature || 0,
          humidity: landInfo.environmentalConditions?.humidity || 0,
          rainfall: landInfo.environmentalConditions?.rainfall || 0,
        },
      },
    };

    console.log(
      "Final farmerData before sending:",
      JSON.stringify(farmerData, null, 2)
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/api/farmer/register",
        farmerData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Registration successful:", response.data);
      toast.success("Registration successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to debug initial values
  useEffect(() => {
    console.log("Initial state:", {
      farmerInfo,
      landInfo,
      userId,
    });
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedGetLocation.cancel();
    };
  }, [debouncedGetLocation]);

  // Render different form steps
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={farmerInfo.name}
                  onChange={handleFarmerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={farmerInfo.age}
                  onChange={handleFarmerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={farmerInfo.state}
                  onChange={handleFarmerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={farmerInfo.district}
                  onChange={handleFarmerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={
                !farmerInfo.name ||
                !farmerInfo.age ||
                !farmerInfo.district ||
                !farmerInfo.state
              }
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Land Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="landDistrict"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  type="text"
                  id="landDistrict"
                  name="district"
                  value={landInfo.district}
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="landState"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="landState"
                  name="state"
                  value={landInfo.state}
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crops
                </label>
                {landInfo.crops.map((crop, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={crop}
                      onChange={(e) => handleCropChange(index, e.target.value)}
                      placeholder="Enter crop name"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeCropField(index)}
                        className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-md border border-red-300 hover:border-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCropField}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-600 hover:text-green-700 hover:border-green-400"
                >
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Crop
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="prev-button"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Soil Properties
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportUploadOption"
                    value="manual"
                    checked={reportUploadOption === "manual"}
                    onChange={() => setReportUploadOption("manual")}
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enter soil details manually
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="reportUploadOption"
                    value="upload"
                    checked={reportUploadOption === "upload"}
                    onChange={() => setReportUploadOption("upload")}
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Upload soil report
                  </span>
                </label>
              </div>

              {reportUploadOption === "manual" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="soilColor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Soil Color
                    </label>
                    <select
                      id="soilColor"
                      name="soilProperties.soilColor"
                      value={landInfo.soilProperties.soilColor}
                      onChange={handleLandInfoChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="">Select Soil Color</option>
                      {Object.keys(DISTRICT_SOIL_MAP.soil_color_map).map(
                        (color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={getNPKValues}
                    disabled={
                      !landInfo.district || !landInfo.soilProperties.soilColor
                    }
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    Get NPK Values
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="nitrogen"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nitrogen (N)
                      </label>
                      <input
                        type="number"
                        id="nitrogen"
                        name="soilProperties.nitrogen"
                        value={landInfo.soilProperties.nitrogen}
                        onChange={handleLandInfoChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phosphorous"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phosphorous (P)
                      </label>
                      <input
                        type="number"
                        id="phosphorous"
                        name="soilProperties.phosphorous"
                        value={landInfo.soilProperties.phosphorous}
                        onChange={handleLandInfoChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="potassium"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Potassium (K)
                      </label>
                      <input
                        type="number"
                        id="potassium"
                        name="soilProperties.potassium"
                        value={landInfo.soilProperties.potassium}
                        onChange={handleLandInfoChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pH"
                        className="block text-sm font-medium text-gray-700"
                      >
                        pH Level
                      </label>
                      <input
                        type="number"
                        id="pH"
                        name="soilProperties.pH"
                        value={landInfo.soilProperties.pH}
                        onChange={handleLandInfoChange}
                        step="0.1"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                          Upload Soil Report
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          PDF, JPG, JPEG, or PNG
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={processSoilReport}
                    disabled={!soilReport}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    Process Report
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Environmental Conditions
            </h2>

            <button
              type="button"
              onClick={getLocationData}
              disabled={!landInfo.district || !landInfo.state}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Get Location & Climate Data
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  value={landInfo.location.coordinates[0]}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  value={landInfo.location.coordinates[1]}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="temperature"
                  className="block text-sm font-medium text-gray-700"
                >
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  id="temperature"
                  name="environmentalConditions.temperature"
                  value={landInfo.environmentalConditions.temperature}
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="humidity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Humidity (%)
                </label>
                <input
                  type="number"
                  id="humidity"
                  name="environmentalConditions.humidity"
                  value={landInfo.environmentalConditions.humidity}
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="rainfall"
                  className="block text-sm font-medium text-gray-700"
                >
                  Annual Rainfall (mm)
                </label>
                <input
                  type="number"
                  id="rainfall"
                  name="environmentalConditions.rainfall"
                  value={landInfo.environmentalConditions.rainfall}
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
              <div className="flex-shrink-0">
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
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-8"
        >
          {renderFormStep()}
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
