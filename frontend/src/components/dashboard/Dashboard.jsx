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
// import { withTranslation } from "react-google-multi-lang";

// Google Calendar API integration
import {
  fetchGoogleCalendarEvents,
  addEventToGoogleCalendar,
} from "../dashboard/utils/fetchGoogleCalendarEvents";

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [showWelcome, setShowWelcome] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState("dashboard"); // "dashboard" or "calendar"
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

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
    loadCalendarEvents();
  }, []);

  const loadCalendarEvents = async () => {
    setIsCalendarLoading(true);
    // Try to fetch from Google Calendar API first
    try {
      const googleEvents = await fetchGoogleCalendarEvents();
      setEvents(googleEvents);
      setIsCalendarLoading(false);
    } catch (error) {
      console.error("Error loading Google Calendar events:", error);
      // Fallback to sample data
      loadSampleEvents();
      // toast.error(
      //   "Couldn't load calendar from Google. Using sample data instead.",
      //   {
      //     position: "top-right",
      //     autoClose: 5000,
      //   }
      // );
      setIsCalendarLoading(false);
    }
  };

  // Function to handle event updates (for the Add Event functionality)
  const handleEventsUpdate = (updatedEvents) => {
    setEvents(updatedEvents);
    toast.success("Event added successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

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
      ) : isCalendarLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-4 text-center py-10">
          Loading calendar events...
        </div>
      ) : (
        <CalendarView events={events} onEventsUpdate={handleEventsUpdate} />
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

// export default withTranslation(Dashboard);
export default Dashboard;
