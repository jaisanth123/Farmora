import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Map,
  TrendingUp,
  BarChart2,
  Droplet,
  Sun,
  Wind,
  Leaf,
  ChevronDown,
} from "lucide-react";

const DemandCrop = () => {
  const [districtName, setDistrictName] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);

  // List of Indian districts
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
    // Other states (partial lis
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

  // Filtered districts based on search
  const filteredDistricts = indianDistricts.filter((district) =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setSearchTerm(""); // Clear search term when closing dropdown
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Focus the search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(filteredDistricts.length > 0 ? 0 : -1);
  }, [filteredDistricts]);

  // Scroll to highlighted item
  useEffect(() => {
    if (isDropdownOpen && highlightedIndex >= 0 && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!districtName.trim()) {
      setError("Please select a district");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Map Chennai to Kancheepuram when sending to backend
      const districtToSend =
        districtName === "Chennai" ? "Erode" : districtName;

      const response = await axios.post("http://127.0.0.1:8000/api/demand", {
        district_name: districtToSend,
      });

      setPredictions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "An error occurred while fetching predictions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district) => {
    setDistrictName(district);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      // Open dropdown on arrow down or enter when selector is focused
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
      return;
    }

    const listLength = filteredDistricts.length;

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < listLength - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < listLength) {
          handleDistrictSelect(filteredDistricts[highlightedIndex]);
        }
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(listLength - 1);
        break;
      default:
        break;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setHighlightedIndex(filteredDistricts.length > 0 ? 0 : -1);
    } else {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 min-h-screen p-6">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Leaf className="h-16 w-16 text-green-500 animate-bounce" />
              <Sun className="h-16 w-16 text-yellow-500 animate-pulse" />
              <Droplet className="h-16 w-16 text-blue-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 animate-pulse">
              Farmer's Crop Advisor
            </h2>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 transform transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                <TrendingUp className="h-8 text-green-500 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Crop Demand Prediction</h1>
                <p className="mt-2 opacity-90">
                  Find the most profitable crops for your region
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white relative">
            <div className="absolute -top-10 right-10">
              <div className="flex space-x-2">
                <div className="bg-green-100 p-3 rounded-full shadow-md animate-pulse">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div className="bg-blue-100 p-3 rounded-full shadow-md animate-pulse delay-150">
                  <Droplet className="h-6 w-6 text-blue-600" />
                </div>
                <div className="bg-yellow-100 p-3 rounded-full shadow-md animate-pulse delay-300">
                  <Sun className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="mb-6 district-dropdown" ref={dropdownRef}>
                <label
                  htmlFor="districtDropdown"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Your District
                </label>
                <div className="relative">
                  <div
                    id="districtDropdown"
                    className={`flex justify-between items-center w-full p-4 ${
                      isDropdownOpen
                        ? "bg-green-100 border-green-300"
                        : "bg-green-50 border-green-200 hover:bg-green-100"
                    } border rounded-lg cursor-pointer transition-colors`}
                    onClick={toggleDropdown}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                    aria-controls="district-listbox"
                    aria-label="Select a district"
                    tabIndex={0}
                  >
                    {!isDropdownOpen ? (
                      <>
                        <div className="flex items-center">
                          <Map className="h-5 w-5 text-green-500 mr-2" />
                          <span>{districtName || "Select a district"}</span>
                        </div>
                        <ChevronDown
                          className="h-5 w-5 text-green-500 transition-transform duration-300"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          ref={searchInputRef}
                          className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                          placeholder="Type to search districts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={handleKeyDown}
                          aria-autocomplete="list"
                          aria-controls="district-listbox"
                        />
                        <ChevronDown
                          className="h-5 w-5 text-green-500 transform rotate-180 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(false);
                            setSearchTerm("");
                            setHighlightedIndex(-1);
                          }}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </div>

                  {isDropdownOpen && (
                    <div
                      id="district-listbox"
                      ref={listboxRef}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
                      role="listbox"
                      aria-label="Districts"
                    >
                      {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district, index) => (
                          <div
                            key={district}
                            id={`district-option-${index}`}
                            className={`p-2 cursor-pointer transition-colors ${
                              highlightedIndex === index
                                ? "bg-green-100 text-green-800"
                                : "hover:bg-green-50"
                            }`}
                            onClick={() => handleDistrictSelect(district)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            role="option"
                            aria-selected={highlightedIndex === index}
                          >
                            {district}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          No districts found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !districtName}
                className="w-full mb-30 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-4 px-4 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center transform hover:scale-[1.02] hover:shadow-lg"
              >
                {loading ? (
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
                    Analyzing Crop Trends...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" /> Predict Best Crops
                  </>
                )}
              </button>
            </form>

            {error && (
              <div
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg animate-pulse"
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {predictions && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 transform transition-all duration-500 animate-fadeIn">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 border-b border-green-200">
              <div className="flex items-center">
                <div className="bg-green-600 p-2 rounded-full mr-3">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-green-800">
                  Top Crops
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200 mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                      >
                        Crop
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                      >
                        Predicted Demand
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {predictions.top_5_crops.map((crop, index) => (
                      <tr
                        key={crop.rank}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-green-50"
                        } transition-all duration-300 hover:bg-green-100`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 ${
                                index === 0
                                  ? "bg-yellow-100 text-yellow-600"
                                  : index === 1
                                  ? "bg-gray-100 text-gray-600"
                                  : index === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-blue-100 text-blue-600"
                              } rounded-full flex items-center justify-center font-semibold text-sm`}
                            >
                              {crop.rank}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">
                                {crop.crop.replace("PRODUCTION_", "")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`bg-green-600 h-2.5 rounded-full`}
                                style={{ width: `${(5 - index) * 20}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">
                              {crop.predicted_demand.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:shadow-md">
                <h3 className="text-md font-semibold text-green-800 mb-3 flex items-center">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Farmer's Analysis
                </h3>
                <p className="text-gray-700">
                  Based on historical production data and market trends, these
                  crops are expected to have the highest demand in{" "}
                  <span className="font-semibold text-green-700">
                    {predictions.district}
                  </span>{" "}
                  for the upcoming season.
                </p>
                <div className="mt-4 flex space-x-2">
                  <div className="bg-green-100 p-3 rounded-lg flex-1 flex items-center">
                    <Leaf className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Best choice for local growing conditions
                    </span>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg flex-1 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      Based on market demand analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DemandCrop;
