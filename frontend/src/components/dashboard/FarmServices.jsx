import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaTractor,
  FaUserFriends,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaLocationArrow,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaHandshake,
  FaTools,
  FaSeedling,
  FaGlobe,
  FaMap,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import EquipmentRental from "./EquipmentRental";
import FarmAssistants from "./FarmAssistants";

const FarmServices = ({ farmerLocation }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("equipment");
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [currentLocationName, setCurrentLocationName] =
    useState("Erode, Tamil Nadu");

  // Get farmer data from backend
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        // Get current user ID from localStorage or context
        const userId = localStorage.getItem("userId") || "demo-user";

        let response;
        if (currentUser) {
          // Use authenticated endpoint like FarmerProfile
          const token = await currentUser.getIdToken();
          response = await axios.get(
            `http://localhost:5000/api/farmer/data/${currentUser.uid}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // Use the original endpoint
          response = await axios.get(
            `http://localhost:5000/api/farmers/profile/${userId}`
          );
        }

        if (response.data && !response.data.error) {
          setFarmerData(response.data);

          // Extract coordinates from the response - handle both data structures
          let coordinates = null;
          if (response.data.landInfo?.location?.coordinates) {
            coordinates = response.data.landInfo.location.coordinates;
          } else if (response.data.location?.coordinates) {
            coordinates = response.data.location.coordinates;
          }

          if (coordinates && coordinates.length >= 2) {
            setUserLocation({
              lat: coordinates[1], // latitude
              lng: coordinates[0], // longitude
            });
            // Get location name from coordinates
            await getLocationNameFromCoordinates(
              coordinates[1],
              coordinates[0]
            );
          } else {
            // Use default location if no coordinates found
            setUserLocation({
              lat: 11.341,
              lng: 77.7274,
            });
            setCurrentLocationName("Erode, Tamil Nadu");
          }
        }
      } catch (error) {
        console.error("Error fetching farmer data:", error);
        // Use default location if API fails
        setUserLocation({
          lat: 11.341,
          lng: 77.7274,
        });
        setCurrentLocationName("Erode, Tamil Nadu");
        // Removed warning toast - default location should be used silently
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [currentUser]);

  // Get location name from coordinates using OpenStreetMap
  const getLocationNameFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );

      const locationData = response.data;
      const locationName = locationData.display_name || `${lat}, ${lng}`;
      setCurrentLocationName(locationName);
    } catch (error) {
      console.error("Error getting location name:", error);
      setCurrentLocationName(`${lat}, ${lng}`);
    }
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    setIsLocationLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      setIsLocationLoading(false);
      return;
    }

    // Function to actually request the location
    const requestLocation = () => {
      // Configure geolocation options for better accuracy
      const options = {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 15000, // 15 seconds timeout
        maximumAge: 60000, // Cache location for 1 minute
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Show success message with coordinates
          toast.success(
            `Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );

          try {
            // Reverse geocoding using OpenStreetMap Nominatim API
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );

            const locationData = response.data;
            const locationName =
              locationData.display_name || `${latitude}, ${longitude}`;

            setUserLocation({ lat: latitude, lng: longitude });
            setCurrentLocationName(locationName);

            toast.success(`Location updated to: ${locationName}`);
          } catch (error) {
            console.error("Error getting location details:", error);
            setUserLocation({ lat: latitude, lng: longitude });
            setCurrentLocationName(`${latitude}, ${longitude}`);
            toast.success("Current location detected! (Coordinates only)");
          } finally {
            setIsLocationLoading(false);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          let errorMessage = "Unable to get current location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please allow location access when prompted by your browser.";
              // Show instructions for enabling location
              toast.error(errorMessage, {
                autoClose: 5000,
                onClose: () => {
                  toast.info(
                    "To enable location: 1) Click the lock icon in your browser 2) Allow location access 3) Refresh the page",
                    {
                      autoClose: 8000,
                    }
                  );
                },
              });
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                "Location information unavailable. Please check your device's GPS settings and try again.";
              toast.error(errorMessage);
              break;
            case error.TIMEOUT:
              errorMessage =
                "Location request timed out. Please check your internet connection and try again.";
              toast.error(errorMessage);
              break;
            default:
              errorMessage =
                "Unable to get current location. Please search manually.";
              toast.error(errorMessage);
          }

          setIsLocationLoading(false);
        },
        options
      );
    };

    // Check if permission is already granted (only if supported)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "denied") {
            toast.error(
              "Location permission denied. Please enable location access in your browser settings and try again.",
              {
                autoClose: 6000,
                onClose: () => {
                  toast.info(
                    "To enable location: 1) Click the lock icon in your browser 2) Allow location access 3) Refresh the page",
                    {
                      autoClose: 8000,
                    }
                  );
                },
              }
            );
            setIsLocationLoading(false);
            return;
          }

          // Permission is granted or prompt, proceed with getting location
          requestLocation();
        })
        .catch(() => {
          // If permissions API fails, try direct geolocation
          requestLocation();
        });
    } else {
      // Fallback for browsers that don't support permissions API
      requestLocation();
    }
  };

  // Search for locations using OpenStreetMap Nominatim API
  const searchLocations = async (query) => {
    if (query.length < 3) {
      setLocationResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )},Tamil Nadu,India&limit=8&addressdetails=1&countrycodes=in&state=Tamil Nadu`
      );

      // Filter results to ensure they're in Tamil Nadu
      const filteredResults = response.data.filter((location) => {
        const address = location.address || {};
        return (
          address.state === "Tamil Nadu" ||
          location.display_name.toLowerCase().includes("tamil nadu") ||
          location.display_name.toLowerCase().includes("tamilnadu")
        );
      });

      setLocationResults(filteredResults);
    } catch (error) {
      console.error("Error searching locations:", error);
      setLocationResults([]);
      toast.error("Failed to search locations. Please try again.");
    }
  };

  // Handle location selection from search results
  const handleLocationSelect = (location) => {
    setUserLocation({
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    });
    setCurrentLocationName(location.display_name);
    setSearchLocation(location.display_name);
    setShowLocationModal(false);
    setLocationResults([]);
    toast.success(`Location updated to ${location.display_name}`);
  };

  const tabs = [
    {
      id: "equipment",
      name: "Equipment Rental",
      icon: <FaTractor />,
      description: "Rent farm equipment from nearby farmers",
    },
    {
      id: "assistants",
      name: "Farm Assistants",
      icon: <FaUserFriends />,
      description: "Hire skilled farm workers",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Farm Services Hub
        </h1>
      </motion.div>

      {/* Location Display */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">Your Location</p>
              <p className="text-xs text-gray-500">
                {currentLocationName}
                {userLocation && (
                  <span className="ml-2 text-gray-400">
                    ({userLocation.lat.toFixed(4)},{" "}
                    {userLocation.lng.toFixed(4)})
                  </span>
                )}
              </p>
              {!userLocation && (
                <p className="text-xs text-orange-600 mt-1">
                  Location not set. Click "Use Current Location" to detect your
                  position.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLocationModal(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <FaMap />
              Search Location
            </button>
            <button
              onClick={getCurrentLocation}
              disabled={isLocationLoading}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {isLocationLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
              ) : (
                <FaLocationArrow />
              )}
              Use Current Location
            </button>
          </div>
        </div>
      </motion.div>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto shadow-2xl border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaGlobe className="mr-2" />
                Search Location
              </h3>

              {/* Search Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for a location in Tamil Nadu:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter town, village, or area name..."
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      searchLocations(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {locationResults.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto bg-white rounded-lg border border-gray-200">
                    {locationResults.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded text-sm border-b border-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-800">
                          {location.display_name.split(",")[0]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {location.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchLocation.length > 0 && locationResults.length === 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    No locations found. Try a different search term.
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    setSearchLocation("");
                    setLocationResults([]);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    setSearchLocation("");
                    setLocationResults([]);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "equipment" && (
              <motion.div
                key="equipment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EquipmentRental farmerLocation={currentLocationName} />
              </motion.div>
            )}

            {activeTab === "assistants" && (
              <motion.div
                key="assistants"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FarmAssistants farmerLocation={currentLocationName} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaSearch className="text-green-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">1. Search</h4>
            <p className="text-sm text-gray-600">
              Find equipment or assistants near your location
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaPhone className="text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">2. Contact</h4>
            <p className="text-sm text-gray-600">
              Call or message the owner/assistant directly
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHandshake className="text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">3. Hire/Rent</h4>
            <p className="text-sm text-gray-600">
              Agree on terms and get started with your farm work
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FarmServices;
