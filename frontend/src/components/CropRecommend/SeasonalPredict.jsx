import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  CloudRain,
  Calendar,
  ChevronDown,
  Wind,
  Sun,
  Snowflake,
  Search,
  AlertCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Comprehensive list of Indian districts with emphasis on Tamil Nadu
const indianDistricts = [
  // Tamil Nadu Districts
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
  // Other states (partial list)
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
  "Adilabad",
  "Anantapur",
  "Chittoor",
  "East Godavari",
  "Guntur",
  "Hyderabad",
  "Kadapa",
  "Karimnagar",
  "Khammam",
  "Krishna",
  "Kurnool",
  "Mahbubnagar",
  "Medak",
  "Nalgonda",
  "Nellore",
  "Nizamabad",
  "Prakasam",
  "Rangareddi",
  "Srikakulam",
  "Visakhapatnam",
  "Vizianagaram",
  "Warangal",
  "West Godavari",
];

// Enhanced list of agricultural seasons in India with icons and correct mapping
const indianSeasons = [
  {
    name: "Monsoon",
    period: "June to October (Monsoon)",
    backendValue: "Kharif", // This will be sent to the backend
    icon: <CloudRain className="h-5 w-5 text-blue-600" />,
    color: "blue",
  },
  {
    name: "Winter",
    period: "October to March (Winter)",
    backendValue: "Rabi", // This will be sent to the backend
    icon: <Snowflake className="h-5 w-5 text-sky-600" />,
    color: "sky",
  },
  {
    name: "Whole Year",
    period: "Whole Year",
    backendValue: "Whole Year", // This will be sent to the backend
    icon: <Snowflake className="h-5 w-5 text-sky-600" />,
    color: "sky",
  },
  {
    name: "Summer",
    period: "March to June (Summer)",
    backendValue: "Autumn", // Updated correct mapping for Summer to Zaid
    icon: <Sun className="h-5 w-5 text-amber-600" />,
    color: "amber",
  },
];

// Helper to get current Indian agricultural season
const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0-indexed (0 = January)
  if (month >= 5 && month <= 9) return "Monsoon"; // June to October
  if (month >= 9 || month <= 2) return "Winter"; // October to March
  return "Summer"; // March to June
};

// Animation variants for Framer Motion
const dropdownVariants = {
  hidden: { opacity: 0, y: -5, height: 0 },
  visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.2 } },
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const resultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SeasonalPredict = () => {
  const [district, setDistrict] = useState("");
  const [season, setSeason] = useState(getCurrentSeason());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // State for dropdowns
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState(indianDistricts);
  const [districtInputValue, setDistrictInputValue] = useState("");
  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  // Refs for scrolling in dropdowns
  const districtListRef = useRef(null);
  const selectedDistrictItemRef = useRef(null);

  // Filter districts when typing in the dropdown
  useEffect(() => {
    if (districtInputValue.trim() === "") {
      setFilteredDistricts(indianDistricts);
    } else {
      const filtered = indianDistricts.filter((district) =>
        district.toLowerCase().includes(districtInputValue.toLowerCase())
      );
      setFilteredDistricts(filtered);
    }
    // Reset selected index when filter changes
    setSelectedDistrictIndex(0);
  }, [districtInputValue]);

  // Set initial selected season index
  useEffect(() => {
    const currentSeasonName = getCurrentSeason();
    const index = indianSeasons.findIndex((s) => s.name === currentSeasonName);
    if (index !== -1) {
      setSelectedSeasonIndex(index);
    }
  }, []);

  // Scroll to selected district when navigating with keyboard
  useEffect(() => {
    if (selectedDistrictItemRef.current && districtListRef.current) {
      selectedDistrictItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedDistrictIndex]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDistrictDropdownOpen &&
        !event.target.closest(".district-dropdown")
      ) {
        setIsDistrictDropdownOpen(false);
      }
      if (isSeasonDropdownOpen && !event.target.closest(".season-dropdown")) {
        setIsSeasonDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDistrictDropdownOpen, isSeasonDropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!district || !season) {
      setError("Please select both district and season");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Find the selected season object to get the backend value
      const selectedSeason = indianSeasons.find((s) => s.name === season);
      const backendSeasonValue = selectedSeason
        ? selectedSeason.backendValue
        : season;

      const response = await fetch("http://127.0.0.1:8000/api/seasonal_crop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district,
          season: backendSeasonValue, // Send the mapped backend value instead of the display name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get prediction");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle district dropdown input - search as you type
  const handleDistrictInputChange = (e) => {
    setDistrictInputValue(e.target.value);
    // Automatically open dropdown when typing
    if (!isDistrictDropdownOpen) {
      setIsDistrictDropdownOpen(true);
    }
  };

  // Handle district selection from dropdown
  const handleDistrictSelect = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setDistrictInputValue(selectedDistrict);
    setIsDistrictDropdownOpen(false);
  };

  // Handle keyboard events for the district dropdown
  const handleDistrictKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsDistrictDropdownOpen(false);
    } else if (e.key === "Enter") {
      if (isDistrictDropdownOpen && filteredDistricts.length > 0) {
        handleDistrictSelect(filteredDistricts[selectedDistrictIndex]);
      } else {
        setIsDistrictDropdownOpen(true);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent scrolling the page
      if (!isDistrictDropdownOpen) {
        setIsDistrictDropdownOpen(true);
      } else {
        setSelectedDistrictIndex((prev) =>
          prev < filteredDistricts.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent scrolling the page
      if (isDistrictDropdownOpen) {
        setSelectedDistrictIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  // Handle keyboard events for the season dropdown
  // Updated handler for season keyboard navigation
  const handleSeasonKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSeasonDropdownOpen(false);
    } else if (e.key === "Enter") {
      if (isSeasonDropdownOpen) {
        // Get filtered seasons (all except the currently selected one)
        const filteredSeasons = indianSeasons.filter((s) => s.name !== season);

        if (
          selectedSeasonIndex >= 0 &&
          selectedSeasonIndex < filteredSeasons.length
        ) {
          const selectedSeason = filteredSeasons[selectedSeasonIndex];
          setSeason(selectedSeason.name);

          // Update the selected index based on the full array
          const newIndex = indianSeasons.findIndex(
            (season) => season.name === selectedSeason.name
          );
          setSelectedSeasonIndex(newIndex);
        }

        setIsSeasonDropdownOpen(false);
      } else {
        setIsSeasonDropdownOpen(true);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isSeasonDropdownOpen) {
        setIsSeasonDropdownOpen(true);
      } else {
        // Get number of filtered items
        const filteredSeasons = indianSeasons.filter((s) => s.name !== season);
        setSelectedSeasonIndex((prev) =>
          prev < filteredSeasons.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isSeasonDropdownOpen) {
        setSelectedSeasonIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  // Get season object by name
  const getCurrentSeasonObject = () => {
    return indianSeasons.find((s) => s.name === season) || indianSeasons[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-green-100 to-white min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 border border-green-100"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ rotate: -15, scale: 0.9 }}
                className="p-3 bg-white bg-opacity-20 rounded-full"
              >
                <CloudRain className="h-8 text-black w-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">
                  Seasonal Crop Recommendation
                </h1>
                <p className="mt-2 opacity-90 text-green-50">
                  Get personalized crop recommendations based on your region and
                  current growing season
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* District Dropdown with integrated search and keyboard navigation */}
                <div className="relative district-dropdown">
                  <label
                    htmlFor="district"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-1 text-green-600" />
                    Select District <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={districtInputValue}
                        onChange={handleDistrictInputChange}
                        onFocus={() => setIsDistrictDropdownOpen(true)}
                        onKeyDown={handleDistrictKeyDown}
                        placeholder="Type to search districts..."
                        className="w-full p-4 pl-12 bg-white border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors shadow-sm"
                        aria-expanded={isDistrictDropdownOpen}
                        aria-haspopup="listbox"
                        aria-controls="district-listbox"
                      />
                      <Search className="h-5 w-5 text-green-600 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setIsDistrictDropdownOpen(!isDistrictDropdownOpen)
                        }
                      >
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                            isDistrictDropdownOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isDistrictDropdownOpen && (
                        <motion.div
                          ref={districtListRef}
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                          id="district-listbox"
                          role="listbox"
                        >
                          {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((d, index) => (
                              <motion.div
                                key={index}
                                ref={
                                  index === selectedDistrictIndex
                                    ? selectedDistrictItemRef
                                    : null
                                }
                                whileHover={{ backgroundColor: "#f0fdf4" }}
                                className={`px-4 py-2 cursor-pointer flex items-center ${
                                  index === selectedDistrictIndex
                                    ? "bg-green-100 text-green-700"
                                    : district === d
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-700"
                                }`}
                                onClick={() => handleDistrictSelect(d)}
                                role="option"
                                aria-selected={index === selectedDistrictIndex}
                              >
                                {(district === d ||
                                  index === selectedDistrictIndex) && (
                                  <Check className="h-4 w-4 text-green-600 mr-2" />
                                )}
                                {d}
                              </motion.div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500 text-sm flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                              No districts found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Season Dropdown - Improved Version with keyboard navigation */}
                {/* Season Dropdown - Updated to hide selected season and handle custom selections */}
                {/* Season Dropdown - Fixed to show all options */}
                {/* Season Dropdown - Fixed with scrollbar */}
                <div className="relative season-dropdown">
                  <label
                    htmlFor="season"
                    className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-1 text-green-600" />
                    Growing Season <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className="w-full p-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer hover:border-green-500 transition-colors shadow-sm"
                      onClick={() => {
                        setIsSeasonDropdownOpen(!isSeasonDropdownOpen);
                        setIsDistrictDropdownOpen(false);
                      }}
                      onKeyDown={handleSeasonKeyDown}
                      tabIndex={0}
                      role="combobox"
                      aria-expanded={isSeasonDropdownOpen}
                      aria-haspopup="listbox"
                      aria-controls="season-listbox"
                    >
                      <div className="flex items-center">
                        {getCurrentSeasonObject().icon}
                        <div className="ml-3">
                          <span className="text-gray-800">{season}</span>
                          {season && (
                            <span className="ml-2 text-xs text-gray-500">
                              {getCurrentSeasonObject().period}
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isSeasonDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isSeasonDropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                          id="season-listbox"
                          role="listbox"
                        >
                          {/* Added max-h-60 and overflow-y-auto for scrollability */}
                          <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                            {/* Show ALL seasons, not just filtered ones */}
                            {indianSeasons.map((s, index) => (
                              <motion.div
                                key={s.name}
                                whileHover={{ backgroundColor: "#f0fdf4" }}
                                className={`px-4 py-3 cursor-pointer ${
                                  s.name === season
                                    ? "bg-green-100 text-green-700"
                                    : index === selectedSeasonIndex &&
                                      s.name !== season
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-700"
                                }`}
                                onClick={() => {
                                  setSeason(s.name);
                                  setIsSeasonDropdownOpen(false);
                                  // Update the selected index based on the full array
                                  const newIndex = indianSeasons.findIndex(
                                    (season) => season.name === s.name
                                  );
                                  setSelectedSeasonIndex(newIndex);
                                }}
                                role="option"
                                aria-selected={
                                  s.name === season ||
                                  index === selectedSeasonIndex
                                }
                              >
                                <div className="font-medium flex items-center">
                                  {s.icon}
                                  <span className="ml-2">{s.name}</span>
                                  {s.name === season && (
                                    <Check className="h-4 w-4 text-green-600 ml-2" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 ml-7">
                                  {s.period}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Optional: Add a custom scrollbar style in your global CSS */}
                          <style jsx global>{`
                            .custom-scrollbar::-webkit-scrollbar {
                              width: 8px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                              background: #f1f1f1;
                              border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                              background: #d1d5db;
                              border-radius: 10px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                              background: #9ca3af;
                            }
                          `}</style>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={loading}
                className="w-full mb-40 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-4 px-4 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center shadow-md"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="mr-3"
                    >
                      <RefreshCw className="h-5 w-5 text-white" />
                    </motion.div>
                    Analyzing Growing Conditions...
                  </>
                ) : (
                  "Get Personalized Crop Recommendations"
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 border border-green-100"
            >
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-green-100 to-green-50 p-6 border-b border-green-200"
              >
                <h2 className="text-xl font-semibold text-green-800">
                  Crop Recommendations for {result.district} in {result.season}{" "}
                  Season
                </h2>
              </motion.div>

              <div className="p-8">
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm mb-8"
                >
                  <div className="flex items-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white shadow-md"
                    >
                      <Check className="h-6 w-6" />
                    </motion.div>
                    <h3 className="ml-4 text-lg font-medium text-green-800">
                      Best Recommended Crop
                    </h3>
                  </div>
                  <div className="ml-16">
                    <motion.p
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="text-3xl font-bold text-green-700 mb-2"
                    >
                      {result.recommended_crop}
                    </motion.p>
                    <div className="bg-white bg-opacity-70 rounded-lg p-3 inline-block">
                      {result.predicted_production !== null ? (
                        <p className="text-gray-700">
                          Predicted Production:{" "}
                          <span className="font-medium text-green-800">
                            {result.predicted_production.toFixed(2)}{" "}
                            tonnes/hectare
                          </span>
                        </p>
                      ) : (
                        <p className="text-gray-700">
                          Predicted Production: Not available
                        </p>
                      )}
                    </div>
                    <motion.p
                      variants={itemVariants}
                      className="text-sm text-gray-600 mt-4 italic bg-white bg-opacity-50 p-3 rounded-lg border-l-2 border-green-300"
                    >
                      {result.note}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.h3
                  variants={itemVariants}
                  className="text-lg font-medium text-green-700 mb-4 flex items-center"
                >
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <ChevronDown className="h-4 w-4 text-green-600" />
                  </span>
                  Top Crops for Your Region
                </motion.h3>
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-green-50 to-green-100">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                          Crop
                        </th>
                        <th className="py-3 px-6 text-right text-xs font-medium text-green-800 uppercase tracking-wider">
                          Average Production
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {result.top_crops.map((crop, index) => (
                        <motion.tr
                          key={crop.rank}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-green-50 transition-colors"
                        >
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-semibold">
                                {crop.rank}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                            {crop.crop}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 text-right">
                            {crop.average_production !== null
                              ? crop.average_production.toFixed(2)
                              : "N/A"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SeasonalPredict;
