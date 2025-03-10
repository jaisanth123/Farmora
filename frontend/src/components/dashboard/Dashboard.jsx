import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Imported Components
import DashboardHeader from "./utils/DashboardHeader";
import ActionMenuBar from "./utils/ActionMenuBar";
import DashboardContent from "./utils/DashboardContent";
import CalendarView from "./utils/CalendarView";
import ChatbotWrapper from "./utils/ChatbotWrapper";

// Google Calendar API integration
import { fetchGoogleCalendarEvents } from "./utils/fetchGoogleCalendarEvents";

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [showWelcome, setShowWelcome] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState("dashboard"); // "dashboard" or "calendar"

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Welcome notification
  useEffect(() => {
    if (showWelcome) {
      toast.success("Welcome back to your farm dashboard!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowWelcome(false);
    }
  }, [showWelcome]);

  // Load calendar events
  useEffect(() => {
    // Try to fetch from Google Calendar API first
    const loadEvents = async () => {
      try {
        const googleEvents = await fetchGoogleCalendarEvents();
        setEvents(googleEvents);
      } catch (error) {
        console.error("Error loading Google Calendar events:", error);
        // Fallback to sample data
        loadSampleEvents();
      }
    };

    loadEvents();
  }, []);

  // Fallback sample events
  const loadSampleEvents = () => {
    const farmEvents = [
      {
        title: "Wheat Harvesting",
        start: new Date(2025, 2, 10),
        end: new Date(2025, 2, 12),
        allDay: true,
        resource: "wheat-field-1",
        color: "#10B981", // green
      },
      {
        title: "Pesticide Application",
        start: new Date(2025, 2, 11),
        end: new Date(2025, 2, 11),
        allDay: true,
        resource: "rice-field-2",
        color: "#F59E0B", // yellow
      },
      {
        title: "Irrigation Check",
        start: new Date(2025, 2, 12),
        end: new Date(2025, 2, 12),
        allDay: true,
        resource: "all-fields",
        color: "#3B82F6", // blue
      },
      {
        title: "Market Visit",
        start: new Date(2025, 2, 15),
        end: new Date(2025, 2, 15),
        allDay: true,
        resource: "sales",
        color: "#8B5CF6", // purple
      },
      {
        title: "Soil Testing",
        start: new Date(2025, 2, 18),
        end: new Date(2025, 2, 19),
        allDay: true,
        resource: "all-fields",
        color: "#EC4899", // pink
      },
    ];

    setEvents(farmEvents);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Header with weather info */}
      <DashboardHeader
        weatherData={weatherData}
        setWeatherData={setWeatherData}
        isWeatherLoading={isWeatherLoading}
        setIsWeatherLoading={setIsWeatherLoading}
        showWelcome={showWelcome}
      />

      {/* Action Menu Bar */}
      <ActionMenuBar viewType={viewType} setViewType={setViewType} />

      {/* Main Content - Dashboard or Calendar */}
      {viewType === "dashboard" ? (
        <DashboardContent events={events} />
      ) : (
        <CalendarView events={events} />
      )}

      {/* Chatbot Component */}
      <ChatbotWrapper
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        setIsChatOpen={setIsChatOpen}
      />
    </div>
  );
};

export default Dashboard;
