// src/components/dashboard/DashboardContent.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaSeedling,
  FaChartLine,
  FaDisease,
  FaComments,
  FaCloudSun,
  FaRulerCombined,
  FaTint,
  FaWind,
  FaTractor,
} from "react-icons/fa";

import QuickActionCard from "../QuickActionCard";
import MarketChart from "../MarketChart";
import StatCard from "../StatCard";
import RecentActivity from "../RecentActivity";
import AgricultureNewsCarousel from "./AgricultureNewsCarousel";
import FarmServices from "../FarmServices";
import { toast } from "react-toastify";

const DashboardContent = ({ events, farmerLocation }) => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);

  // Quick action cards data with descriptions
  const quickActions = [
    {
      title: "Crop Recommendation",
      description: "Get AI-powered crop suggestions",
      icon: <FaSeedling size={24} />,
      path: "/crop-recommendation",
      color: "border-green-500 hover:shadow-green-100",
      delay: 0.1,
    },
    {
      title: "Disease Diagnosis",
      description: "Identify plant diseases with AI",
      icon: <FaDisease size={24} />,
      path: "/disease",
      color: "border-red-500 hover:shadow-red-100",
      delay: 0.2,
    },
    {
      title: "Market Analysis",
      description: "Track price trends and forecasts",
      icon: <FaChartLine size={24} />,
      path: "/market-analysis",
      color: "border-blue-500 hover:shadow-blue-100",
      delay: 0.3,
    },
    {
      title: "Farm Services",
      description: "Rent equipment & hire assistants",
      icon: <FaTractor size={24} />,
      path: "/farm-services",
      color: "border-orange-500 hover:shadow-orange-100",
      delay: 0.4,
    },
    {
      title: "Discussion Forum",
      description: "Connect with other farmers",
      icon: <FaComments size={24} />,
      path: "/forum",
      color: "border-purple-500 hover:shadow-purple-100",
      delay: 0.5,
    },
    {
      title: "Weather Forecast",
      description: "7-day weather predictions",
      icon: <FaCloudSun size={24} />,
      path: "/weather",
      color: "border-yellow-500 hover:shadow-yellow-100",
      delay: 0.6,
    },
  ];

  // Farm stats data
  const farmStats = [
    {
      title: "Crops Planted",
      value: "3",
      change: "+1",
      icon: <FaSeedling className="text-green-500" />,
      path: "/crops",
      delay: 0.2,
    },
    {
      title: "Market Price",
      value: "₹2,450/q",
      change: "+8%",
      icon: <FaChartLine className="text-blue-500" />,
      path: "/market-prices",
      delay: 0.3,
    },
    {
      title: "Disease Alerts",
      value: "2",
      change: "+1",
      icon: <FaDisease className="text-red-500" />,
      path: "/disease-alerts",
      delay: 0.4,
    },
    {
      title: "Land Area",
      value: "4.5 acres",
      change: "",
      icon: <FaRulerCombined className="text-yellow-500" />,
      path: "/land-management",
      delay: 0.5,
    },
  ];

  // Fetch weather data (similar to DashboardHeader)
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsWeatherLoading(true);
      try {
        const apiKey =
          "1172476f50624984850114232250203" || process.env.VITE_WEATHER_API;

        // Use farmer location from props, or default to Erode,India
        const location = farmerLocation || "Chennai,India";

        // Fetch current weather
        const currentResponse = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
        );

        // Fetch forecast data (3 days)
        const forecastResponse = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no`
        );

        console.log("Weather API Current Response:", currentResponse.data);
        console.log("Weather API Forecast Response:", forecastResponse.data);

        // Set current weather data
        setWeatherData({
          temp: currentResponse.data.current.temp_c,
          condition: currentResponse.data.current.condition.text,
          description:
            currentResponse.data.current.condition.text.toLowerCase(),
          humidity: currentResponse.data.current.humidity,
          windSpeed: currentResponse.data.current.wind_kph / 3.6, // Convert km/h to m/s
          icon: currentResponse.data.current.condition.icon,
          location: `${currentResponse.data.location.name}, ${currentResponse.data.location.country}`,
        });

        // Process forecast data for next few days
        const processedForecast =
          forecastResponse.data.forecast.forecastday.map((day) => ({
            day: format(new Date(day.date), "EEE"),
            high: Math.round(day.day.maxtemp_c),
            low: Math.round(day.day.mintemp_c),
            icon: day.day.condition.icon,
            condition: day.day.condition.text,
          }));

        setForecastData(processedForecast);
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

        // Set mock forecast data
        setForecastData([
          {
            day: "Today",
            high: 33,
            low: 24,
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
            condition: "Sunny",
          },
          {
            day: "Mon",
            high: 34,
            low: 25,
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
            condition: "Partly cloudy",
          },
          {
            day: "Tue",
            high: 30,
            low: 23,
            icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
            condition: "Patchy rain possible",
          },
        ]);

        toast.warning("Using demo weather data. API connection issue.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, [farmerLocation]);

  return (
    <>
      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            path={action.path}
            color={action.color}
            delay={action.delay}
          />
        ))}
      </div>
      <AgricultureNewsCarousel />

      {/* Weather Summary Card - Updated to use real API data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 bg-white p-4 rounded-lg shadow-sm"
        onClick={() => navigate("/weather")}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Weather Forecast</h2>
          <button className="text-sm text-green-500 hover:underline flex items-center">
            <FaCloudSun className="mr-1" size={14} />
            View Details
          </button>
        </div>

        {isWeatherLoading ? (
          <div className="flex items-center space-x-2 p-4 justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-gray-500">Loading weather...</span>
          </div>
        ) : weatherData ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {weatherData.icon && (
                <img
                  src={weatherData.icon}
                  alt={weatherData.condition}
                  className="w-12 h-12 mr-2"
                />
              )}
              <div className="ml-2">
                <p className="text-sm text-gray-500">{weatherData.location}</p>
                <p className="text-2xl font-bold">
                  {Math.round(weatherData.temp)}°C
                </p>
                <p className="text-sm capitalize">{weatherData.description}</p>
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FaTint className="mr-1" />
                    <span>{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <FaWind className="mr-1" />
                    <span>{weatherData.windSpeed.toFixed(1)} m/s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 ml-4">
              {forecastData.map((day, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-gray-500">{day.day}</p>
                  <img
                    src={day.icon}
                    alt={day.condition}
                    className="w-8 h-8 mx-auto"
                  />
                  <p className="text-xs">
                    <span className="text-red-500">{day.high}°</span>
                    {" / "}
                    <span className="text-blue-500">{day.low}°</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-red-500 p-4 text-center">
            Weather data unavailable
          </div>
        )}
      </motion.div>

      {/* Market Analysis Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 bg-white p-4 rounded-lg shadow-sm"
      >
        <h2 className="text-lg font-medium mb-4">Market Price Trends</h2>
        <MarketChart />
      </motion.div>

      {/* Farm Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {farmStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: stat.delay }}
            whileHover={{ y: -5 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              theme="light"
              onClick={() => (window.location.href = stat.path)}
            />
          </motion.div>
        ))}
      </div>

      {/* Farm Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <FarmServices farmerLocation={farmerLocation} />
      </motion.div>

      {/* Recent Activity and Upcoming Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
            <RecentActivity />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium mb-4 flex justify-between items-center">
              <span>Upcoming Tasks</span>
              <button
                onClick={() => (window.location.hash = "#calendar")}
                className="text-sm text-green-500 flex items-center hover:underline"
              >
                <FaCalendarAlt className="mr-1" size={12} />
                View Calendar
              </button>
            </h2>
            <ul className="space-y-3">
              {events
                .filter((event) => new Date(event.start) >= new Date())
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .slice(0, 3)
                .map((event, index) => (
                  <li
                    key={index}
                    className="flex items-center p-2 border-l-4 rounded"
                    style={{
                      borderLeftColor: event.color || "#3B82F6",
                      backgroundColor: `${event.color}10` || "#3B82F610",
                    }}
                  >
                    <span className="font-medium">{event.title}</span>
                    <span className="ml-auto text-sm text-gray-500">
                      {format(new Date(event.start), "MMM d")}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardContent;
