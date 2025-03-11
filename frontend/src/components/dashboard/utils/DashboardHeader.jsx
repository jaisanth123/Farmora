import React, { useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTint, FaWind } from "react-icons/fa";
import { withTranslation } from "react-google-multi-lang";
const DashboardHeader = ({
  weatherData,
  setWeatherData,
  isWeatherLoading,
  setIsWeatherLoading,
  showWelcome,
  farmerLocation, // Add new prop for farmer location
}) => {
  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsWeatherLoading(true);
      try {
        const apiKey =
          "1172476f50624984850114232250203" || process.env.VITE_WEATHER_API;

        // Use farmer location from props, or default to Delhi,India
        const location = farmerLocation || "Erode,India";

        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
        );

        // Log full response for debugging
        console.log("Weather API Response:", response.data);

        setWeatherData({
          temp: response.data.current.temp_c,
          condition: response.data.current.condition.text,
          description: response.data.current.condition.text.toLowerCase(),
          humidity: response.data.current.humidity,
          windSpeed: response.data.current.wind_kph / 3.6, // Convert km/h to m/s
          icon: response.data.current.condition.icon,
          location: `${response.data.location.name}, ${response.data.location.country}`,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // Use mock data if API fetch fails
        setWeatherData({
          temp: 28,
          condition: "Sunny",
          description: "clear sky",
          humidity: 65,
          windSpeed: 3.2,
          icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
          location: farmerLocation || "Your Farm",
        });

        if (showWelcome) {
          toast.warning("Using demo weather data. API connection issue.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, [setWeatherData, setIsWeatherLoading, showWelcome, farmerLocation]); // Add farmerLocation to dependency array

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-black"
      >
        Farmer's Dashboard
      </motion.h1>

      {/* Weather Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center mt-2 md:mt-0 bg-white p-3 rounded-lg shadow-sm"
      >
        {isWeatherLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-gray-500">Loading weather...</span>
          </div>
        ) : weatherData ? (
          <>
            <div className="flex items-center">
              {weatherData.icon && (
                <img
                  src={weatherData.icon}
                  alt={weatherData.condition}
                  className="w-12 h-12 mr-2"
                />
              )}
              <div>
                <div className="flex items-center">
                  <span className="font-bold text-lg">
                    {Math.round(weatherData.temp)}°C
                  </span>
                  <span className="text-gray-600 text-sm ml-2 capitalize">
                    {weatherData.description}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {weatherData.location}
                </div>
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FaTint className="mr-1" />
                    <span>{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <FaWind className="mr-1" />
                    <span>{weatherData.windSpeed.toFixed(3)} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-red-500">Weather data unavailable</div>
        )}
      </motion.div>
    </div>
  );
};

export default withTranslation(DashboardHeader);
