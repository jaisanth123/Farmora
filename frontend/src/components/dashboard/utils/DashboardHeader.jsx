// src/components/dashboard/DashboardHeader.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTint, FaWind } from "react-icons/fa";

const DashboardHeader = ({
  weatherData,
  setWeatherData,
  isWeatherLoading,
  setIsWeatherLoading,
  showWelcome,
}) => {
  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsWeatherLoading(true);
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API;
        const location = "Delhi,in"; // Example: Delhi, India

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
        );

        setWeatherData({
          temp: response.data.main.temp,
          condition: response.data.weather[0].main,
          description: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
          location: response.data.name,
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
          icon: "http://openweathermap.org/img/wn/01d@2x.png",
          location: "Your Farm",
        });

        if (showWelcome) {
          toast.warning("Using demo weather data. API key may be missing.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, [setWeatherData, setIsWeatherLoading, showWelcome]);

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
                    <span>{weatherData.windSpeed} m/s</span>
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

export default DashboardHeader;
