// src/components/dashboard/DashboardContent.jsx
import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaSeedling,
  FaChartLine,
  FaDisease,
  FaComments,
  FaCloudSun,
  FaRulerCombined,
} from "react-icons/fa";

import QuickActionCard from "../QuickActionCard";
import MarketChart from "../MarketChart";
import StatCard from "../StatCard";
import RecentActivity from "../RecentActivity";
import NewsDetailComponent from "./NewsDetailComponent";
import AgricultureNewsCarousel from "./AgricultureNewsCarousel";
import PlantDiseaseUploader from "../../PlantDisease/PlantDiseaseUploader";
import { useState } from "react";

const DashboardContent = ({ events }) => {
  const [selectedNews, setSelectedNews] = useState(null);
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
      path: "/disease-diagnosis",
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
      title: "Discussion Forum",
      description: "Connect with other farmers",
      icon: <FaComments size={24} />,
      path: "/forum",
      color: "border-purple-500 hover:shadow-purple-100",
      delay: 0.4,
    },
    {
      title: "Weather Forecast",
      description: "7-day weather predictions",
      icon: <FaCloudSun size={24} />,
      path: "/weather",
      color: "border-yellow-500 hover:shadow-yellow-100",
      delay: 0.5,
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

  // Added a weather summary for the dashboard
  const weatherSummary = {
    location: "Delhi, India",
    current: {
      temp: 32,
      weather: "Clear",
      icon: <FaCloudSun className="text-yellow-500" size={24} />,
    },
    forecast: [
      {
        day: "Today",
        high: 33,
        low: 24,
        icon: <FaCloudSun size={18} className="text-yellow-500" />,
      },
      {
        day: "Mon",
        high: 34,
        low: 25,
        icon: <FaCloudSun size={18} className="text-blue-400" />,
      },
      {
        day: "Tue",
        high: 30,
        low: 23,
        icon: <FaCloudSun size={18} className="text-blue-600" />,
      },
    ],
  };
  const handleNewsClick = (news) => {
    setSelectedNews(news);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToNews = () => {
    setSelectedNews(null);
  };

  return (
    <>
      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
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
      {selectedNews ? (
        <NewsDetailComponent news={selectedNews} onBack={handleBackToNews} />
      ) : (
        <AgricultureNewsCarousel onNewsClick={handleNewsClick} />
      )}

      {/* Weather Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 bg-white p-4 rounded-lg shadow-sm"
        onClick={() => (window.location.href = "/weather")}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Weather Forecast</h2>
          <button className="text-sm text-green-500 hover:underline flex items-center">
            <FaCloudSun className="mr-1" size={14} />
            View Details
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {weatherSummary.current.icon}
            <div className="ml-2">
              <p className="text-sm text-gray-500">{weatherSummary.location}</p>
              <p className="text-2xl font-bold">
                {weatherSummary.current.temp}°C
              </p>
              <p className="text-sm">{weatherSummary.current.weather}</p>
            </div>
          </div>

          <div className="flex space-x-4 ml-4">
            {weatherSummary.forecast.map((day, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-500">{day.day}</p>
                {day.icon}
                <p className="text-xs">
                  <span className="text-red-500">{day.high}°</span>
                  {" / "}
                  <span className="text-blue-500">{day.low}°</span>
                </p>
              </div>
            ))}
          </div>
        </div>
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

      {/* Recent Activity and Upcoming Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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
