import React, { useState, useEffect } from "react";

// Indian states data
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Tamil Nadu districts data
const tamilNaduDistricts = [
  "Ariyalur",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Salem",
  "Sivaganga",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
  "Tenkasi",
  "Chengalpattu",
  "Ranipet",
  "Kallakurichi",
  "Tirupattur",
  "Mayiladuthurai",
];

// All districts mapping
const districtsByState = {
  "Tamil Nadu": tamilNaduDistricts,
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane"],
  // More states would be included in a full implementation
};

// Suggested crops based on states and districts
const suggestedCrops = {
  "Tamil Nadu": {
    general: ["Rice", "Sugarcane", "Bananas", "Coconut"],
    Madurai: ["Rice", "Sugarcane", "Cotton", "Pulses"],
    Coimbatore: ["Cotton", "Maize", "Turmeric", "Coconut"],
    Thanjavur: ["Rice", "Pulses", "Black Gram", "Green Gram"],
  },
  Karnataka: {
    general: ["Coffee", "Ragi", "Jowar", "Sunflower"],
  },
};

const Step2LandInfo = ({ landInfo, setLandInfo, setStep }) => {
  const [loading, setLoading] = useState(false);
  const [cropSuggestions, setCropSuggestions] = useState([]);
  const [notification, setNotification] = useState(null);

  // Initialize with empty crops array if not present
  useEffect(() => {
    if (!landInfo.crops) {
      setLandInfo((prev) => ({ ...prev, crops: [""] }));
    }
  }, []);

  // Update district options when state changes
  useEffect(() => {
    if (landInfo.state) {
      // Show loading animation briefly
      setLoading(true);
      setTimeout(() => setLoading(false), 500);

      // Update crop suggestions based on state
      const stateCrops = suggestedCrops[landInfo.state]?.general || [];
      setCropSuggestions(stateCrops);
    }
  }, [landInfo.state]);

  // Update crop suggestions when district changes
  useEffect(() => {
    if (landInfo.state && landInfo.district) {
      const stateCrops = suggestedCrops[landInfo.state] || {};
      const districtCrops =
        stateCrops[landInfo.district] || stateCrops.general || [];
      setCropSuggestions(districtCrops);
    }
  }, [landInfo.district]);

  const handleLandInfoChange = (name, value) => {
    setLandInfo((prev) => ({ ...prev, [name]: value }));

    // If changing state, reset district
    if (name === "state") {
      setLandInfo((prev) => ({ ...prev, district: "" }));
    }

    // Show notification
    setNotification({
      message: `Updated ${name} to ${value}`,
    });

    // Hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCropChange = (index, value) => {
    const updatedCrops = [...landInfo.crops];
    updatedCrops[index] = value;
    setLandInfo({ ...landInfo, crops: updatedCrops });
  };

  const addCropField = () => {
    setLandInfo({ ...landInfo, crops: [...landInfo.crops, ""] });
  };

  const removeCropField = (index) => {
    const updatedCrops = [...landInfo.crops];
    updatedCrops.splice(index, 1);
    setLandInfo({ ...landInfo, crops: updatedCrops });
  };

  const getDistrictOptions = () => {
    return districtsByState[landInfo.state] || [];
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center justify-between animate-pulse">
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-green-800">Land Information</h2>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* State Selection - Placed first as requested */}
        <div className="mb-6">
          <label
            htmlFor="landState"
            className="block text-lg font-medium text-gray-700 mb-2 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            State
          </label>

          <select
            id="landState"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={landInfo.state || ""}
            onChange={(e) => handleLandInfoChange("state", e.target.value)}
          >
            <option value="">Select your state</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District Selection - Placed second as requested */}
        <div className="mb-6">
          <label
            htmlFor="landDistrict"
            className="block text-lg font-medium text-gray-700 mb-2 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            District
          </label>

          {loading ? (
            <div className="w-full flex justify-center p-4">
              <svg
                className="animate-spin h-8 w-8 text-green-600"
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
            </div>
          ) : (
            <select
              id="landDistrict"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={landInfo.district || ""}
              onChange={(e) => handleLandInfoChange("district", e.target.value)}
              disabled={!landInfo.state}
            >
              <option value="">Select your district</option>
              {getDistrictOptions().map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Crops Section with Suggestions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-lg font-medium text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Crops
            </label>

            <div className="relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 cursor-help"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Crop suggestions */}
          {cropSuggestions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Suggested crops for your region:
              </p>
              <div className="flex flex-wrap gap-2">
                {cropSuggestions.map((crop, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors duration-200"
                    onClick={() => {
                      // Find empty crop field or add new one
                      const emptyIndex = landInfo.crops.findIndex((c) => !c);
                      if (emptyIndex >= 0) {
                        handleCropChange(emptyIndex, crop);
                      } else {
                        setLandInfo({
                          ...landInfo,
                          crops: [...landInfo.crops, crop],
                        });
                      }
                    }}
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {landInfo.crops &&
            landInfo.crops.map((crop, index) => (
              <div key={index} className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={crop}
                  onChange={(e) => handleCropChange(index, e.target.value)}
                  placeholder="Enter crop name"
                  list="cropSuggestions"
                />

                <datalist id="cropSuggestions">
                  {cropSuggestions
                    .filter((c) => !landInfo.crops.includes(c))
                    .map((c) => (
                      <option key={c} value={c} />
                    ))}
                </datalist>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeCropField(index)}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-300 hover:border-red-400 transition-colors duration-200"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

          <button
            type="button"
            onClick={addCropField}
            className="mt-2 inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-400 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
          className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2LandInfo;
