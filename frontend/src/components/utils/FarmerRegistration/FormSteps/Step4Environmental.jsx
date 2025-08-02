import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  MapPin,
  Cloud,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Compass,
  ArrowLeft,
  Check,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Tooltip, Legend } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Step4Environmental = ({
  landInfo,
  setLandInfo,
  setStep,
  getLocationData,
}) => {
  const [showChart, setShowChart] = useState(false);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleLandInfoChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");
    setLandInfo((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value },
    }));
  };

  const fetchWeatherByLocation = async () => {
    setError(null);

    // First, get the location data (coordinates, etc.)
    getLocationData();

    // Construct location string from district and state
    const locationName = `${landInfo.district}, ${landInfo.state}, India`;

    try {
      toast.info("Fetching climate data...");
      const apiKey = "1172476f50624984850114232250203";

      // Fetch current weather
      const currentResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationName}&aqi=no`
      );

      // Fetch forecast data (7 days)
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationName}&days=7&aqi=no`
      );

      processWeatherData(currentResponse.data, forecastResponse.data);
      toast.success("Climate data fetched successfully!");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(
        "Failed to fetch weather data. Please try again or use coordinates."
      );
      toast.error("Failed to fetch climate data. Please try again.");
    }
  };

  const processWeatherData = (currentData, forecastData) => {
    // Extract current weather data
    const current = currentData.current;

    // Update landInfo with real data
    setLandInfo((prev) => ({
      ...prev,
      environmentalConditions: {
        ...prev.environmentalConditions,
        temperature: current.temp_c,
        humidity: current.humidity,
        // Use average monthly rainfall data for the region - this is estimated as
        // the WeatherAPI doesn't provide annual rainfall directly
        rainfall: Math.round(current.precip_mm * 365), // Very rough estimate
      },
    }));

    // Extract forecast data for chart
    const forecastDays = forecastData.forecast.forecastday;

    // Generate historical data based on forecast (as historical data isn't available in the free API)
    // This is a simplification for demonstration purposes
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    // Create a rough distribution of weather across the year based on current conditions
    const weatherHistory = months.map((month, index) => {
      // Create a seasonal variation pattern
      const monthIndex = (currentMonth + index) % 12;
      const seasonalOffset = Math.sin(
        (monthIndex / 12) * 2 * Math.PI - Math.PI / 2
      );

      // Base values from current conditions
      const baseTemp = current.temp_c;
      const baseHumidity = current.humidity;
      const baseRainfall = current.precip_mm * 30; // Monthly estimate

      // Apply seasonal variations
      return {
        month,
        temperature: Math.round(baseTemp + seasonalOffset * 5), // 5°C seasonal variation
        humidity: Math.min(
          100,
          Math.max(20, Math.round(baseHumidity + seasonalOffset * 15))
        ), // 15% seasonal variation
        rainfall: Math.max(
          10,
          Math.round(baseRainfall + seasonalOffset * baseRainfall)
        ), // Seasonal rainfall variation
      };
    });

    setWeatherHistory(weatherHistory);
    setShowChart(true);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  // Weather recommendation based on values
  const getWeatherRecommendation = () => {
    const { temperature, humidity, rainfall } =
      landInfo.environmentalConditions;

    if (!temperature || !humidity || !rainfall) return null;

    const temp = parseFloat(temperature);
    const humid = parseFloat(humidity);
    const rain = parseFloat(rainfall);

    if (temp > 30 && humid > 70) {
      return {
        text: "High temperature and humidity conditions. Consider crops that thrive in hot, humid environments.",
        crops: ["Rice", "Sugarcane", "Jute"],
        icon: <Sun className="text-yellow-500" />,
      };
    } else if (rain > 1500) {
      return {
        text: "High rainfall area. Good for water-intensive crops.",
        crops: ["Rice", "Tea", "Rubber"],
        icon: <Cloud className="text-blue-500" />,
      };
    } else if (temp < 25 && rain < 1000) {
      return {
        text: "Moderate temperature and rainfall. Suitable for diverse cropping.",
        crops: ["Wheat", "Millets", "Pulses"],
        icon: <Thermometer className="text-green-500" />,
      };
    } else {
      return {
        text: "Standard conditions suitable for most common crops in your region.",
        crops: ["Mixed vegetables", "Cotton", "Oilseeds"],
        icon: <Wind className="text-gray-500" />,
      };
    }
  };

  const recommendation = getWeatherRecommendation();

  // UI Enhancements
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-500/20 rounded-lg -z-10" />
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-semibold text-green-800 flex items-center">
            <Cloud className="mr-2 text-green-600" />
            Environmental Analysis
          </h2>
          <motion.div>
            <Compass className="h-6 w-6 text-blue-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Location Data Button */}
      <motion.div variants={itemVariants}>
        <motion.button
          type="button"
          onClick={fetchWeatherByLocation}
          disabled={!landInfo.district || !landInfo.state}
          className="w-full px-4 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="mr-2 h-5 w-5" />
          Get Intelligent Climate Analysis
        </motion.button>
        {(!landInfo.district || !landInfo.state) && (
          <p className="mt-1 text-xs text-orange-500">
            Please select state and district first to enable location data
          </p>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </motion.div>

      {/* Coordinates and Climate Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coordinates Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center text-green-700 mb-3 border-b border-gray-100 pb-2">
            <MapPin className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Location Data</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="longitude"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                Longitude
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="longitude"
                  value={landInfo.location.coordinates[0]}
                  readOnly
                  className="pl-8 block w-full rounded-md border-gray-200 bg-gray-50 shadow-sm text-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Compass className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="latitude"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                Latitude
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="latitude"
                  value={landInfo.location.coordinates[1]}
                  readOnly
                  className="pl-8 block w-full rounded-md border-gray-200 bg-gray-50 shadow-sm text-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Compass className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          {landInfo.location.coordinates[0] !== 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded-md flex items-center"
            >
              <Check className="h-3 w-3 mr-1" />
              Location data successfully retrieved
            </motion.div>
          )}
        </motion.div>

        {/* Temperature Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center text-orange-600 mb-3 border-b border-gray-100 pb-2">
            <Thermometer className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Temperature</h3>
          </div>
          <div className="relative">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Sun className="h-20 w-20 text-yellow-500" />
            </div>
            <label
              htmlFor="temperature"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Temperature (°C)
            </label>
            <div className="relative">
              <input
                type="number"
                id="temperature"
                name="environmentalConditions.temperature"
                value={landInfo.environmentalConditions.temperature}
                onChange={handleLandInfoChange}
                required
                className="pl-8 block w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                placeholder="Enter average temperature"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Thermometer className="h-4 w-4 text-orange-400" />
              </div>
            </div>
            {landInfo.environmentalConditions.temperature && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: `${Math.min(
                    landInfo.environmentalConditions.temperature * 2.5,
                    100
                  )}%`,
                }}
                className="h-1 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 mt-2 rounded-full"
              />
            )}
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>0°C</span>
              <span>40°C</span>
            </div>
          </div>
        </motion.div>

        {/* Humidity Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center text-blue-600 mb-3 border-b border-gray-100 pb-2">
            <Droplets className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Humidity</h3>
          </div>
          <div className="relative">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Droplets className="h-20 w-20 text-blue-500" />
            </div>
            <label
              htmlFor="humidity"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Humidity (%)
            </label>
            <div className="relative">
              <input
                type="number"
                id="humidity"
                name="environmentalConditions.humidity"
                value={landInfo.environmentalConditions.humidity}
                onChange={handleLandInfoChange}
                required
                className="pl-8 block w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                placeholder="Enter average humidity"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Droplets className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            {landInfo.environmentalConditions.humidity && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: `${Math.min(
                    landInfo.environmentalConditions.humidity,
                    100
                  )}%`,
                }}
                className="h-1 bg-gradient-to-r from-blue-200 to-blue-600 mt-2 rounded-full"
              />
            )}
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>

        {/* Rainfall Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center text-blue-700 mb-3 border-b border-gray-100 pb-2">
            <Cloud className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Annual Rainfall</h3>
          </div>
          <div className="relative">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Cloud className="h-20 w-20 text-blue-500" />
            </div>
            <label
              htmlFor="rainfall"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Annual Rainfall (mm)
            </label>
            <div className="relative">
              <input
                type="number"
                id="rainfall"
                name="environmentalConditions.rainfall"
                value={landInfo.environmentalConditions.rainfall}
                onChange={handleLandInfoChange}
                required
                className="pl-8 block w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                placeholder="Enter annual rainfall"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Cloud className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            {landInfo.environmentalConditions.rainfall && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{
                  width: `${Math.min(
                    landInfo.environmentalConditions.rainfall / 30,
                    100
                  )}%`,
                }}
                className="h-1 bg-gradient-to-r from-blue-300 to-indigo-600 mt-2 rounded-full"
              />
            )}
            <div className="mt-1 text-xs text-gray-500 flex justify-between">
              <span>0mm</span>
              <span>3000mm</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weather Recommendation Section */}
      {recommendation && (
        <AnimatePresence>
          <motion.div
            variants={fadeInVariants}
            className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100 mt-4"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white p-2 rounded-full mr-3">
                {recommendation.icon}
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-1">
                  Climate Analysis
                </h3>
                <p className="text-sm text-gray-600">{recommendation.text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recommendation.crops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Weather History Chart */}
      {showChart && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.5 }}
          className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <Cloud className="mr-2 h-4 w-4 text-blue-500" />
            Annual Climate Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weatherHistory}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#22c55e"
                  activeDot={{ r: 8 }}
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#9333ea"
                  name="Humidity (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#3b82f6"
                  name="Rainfall (mm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div variants={itemVariants} className="flex justify-between mt-8">
        <motion.button
          type="button"
          onClick={() => setStep(3)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </motion.button>

        <motion.button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit <Check className="ml-2 h-4 w-4" />
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

export default Step4Environmental;
