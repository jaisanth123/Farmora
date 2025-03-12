import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { toast } from "react-toastify";
import axios from "axios";
import { addEventToGoogleCalendar } from "./fetchGoogleCalendarEvents";
import {
  Cloud,
  Sun,
  Droplets,
  Sprout,
  Tractor,
  Calendar as CalendarIcon,
  PlusCircle,
  X,
  ChevronDown,
  Shovel,
  Wind,
} from "lucide-react";

// Locale configuration for calendar
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Weather component to show current conditions - enhanced with real API data
const WeatherWidget = ({ weatherData, isWeatherLoading }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-3 flex items-center space-x-3 shadow-sm">
      {isWeatherLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span className="text-gray-500 text-sm">Loading weather...</span>
        </div>
      ) : weatherData ? (
        <>
          <div className="bg-blue-500 text-white p-2 rounded-full">
            {weatherData.icon ? (
              <img
                src={weatherData.icon}
                alt={weatherData.condition}
                className="w-6 h-6"
              />
            ) : (
              <Sun size={20} />
            )}
          </div>
          <div>
            <p className="text-sm text-black font-medium">
              {Math.round(weatherData.temp)}°C • {weatherData.condition}
            </p>
            <div className="flex space-x-3 text-xs text-gray-600">
              <span>Humidity: {weatherData.humidity}%</span>
              <span>Wind: {weatherData.windSpeed.toFixed(1)} m/s</span>
            </div>
            <p className="text-xs text-gray-600">{weatherData.location}</p>
          </div>
        </>
      ) : (
        <div className="text-red-500 text-sm">Weather data unavailable</div>
      )}
    </div>
  );
};

// Season progress indicator
const SeasonProgress = () => {
  const progress = 65; // Example: 65% through the growing season
  const season = "Growing Season";

  return (
    <div className="bg-green-50 rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">{season}</span>
        <span className="text-xs font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-green-300 to-green-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const CalendarView = ({ events, onEventsUpdate, farmerLocation }) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedView, setSelectedView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherAlerts, setWeatherAlerts] = useState([
    { type: "Rain", message: "Heavy rain expected tomorrow", date: "Mar 13" },
  ]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
    resource: "",
    type: "other",
  });

  // Weather state
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Fetch weather data - integrated from DashboardHeader
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsWeatherLoading(true);
      try {
        const apiKey =
          "1172476f50624984850114232250203" || process.env.VITE_WEATHER_API;

        // Use farmer location from props, or default to Erode, India
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

        // Check for weather alerts based on conditions - simple implementation
        const weatherCondition =
          response.data.current.condition.text.toLowerCase();
        const currentAlerts = [...weatherAlerts];

        // Add alert if rainy conditions detected
        if (
          weatherCondition.includes("rain") ||
          weatherCondition.includes("shower")
        ) {
          const existingAlert = currentAlerts.find(
            (alert) => alert.type === "Rain"
          );
          if (!existingAlert) {
            currentAlerts.push({
              type: "Rain",
              message: "Rain detected in your area",
              date: format(new Date(), "MMM d"),
            });
            setWeatherAlerts(currentAlerts);
          }
        }

        // Add alert if windy conditions detected
        if (response.data.current.wind_kph > 20) {
          const existingAlert = currentAlerts.find(
            (alert) => alert.type === "Wind"
          );
          if (!existingAlert) {
            currentAlerts.push({
              type: "Wind",
              message: "High winds detected - secure equipment",
              date: format(new Date(), "MMM d"),
            });
            setWeatherAlerts(currentAlerts);
          }
        }
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

        toast.warning("Using demo weather data. API connection issue.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();

    // Set up interval to refresh weather data every 30 minutes
    const weatherInterval = setInterval(fetchWeatherData, 30 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(weatherInterval);
  }, [farmerLocation]); // Refresh when farmer location changes

  // Event types with their corresponding colors and icons
  const eventTypes = [
    {
      id: "harvest",
      label: "Harvest",
      color: "#10B981",
      icon: <Sprout size={16} />,
    },
    {
      id: "pesticide",
      label: "Pesticide",
      color: "#F59E0B",
      icon: <Sprout size={16} />,
    },
    {
      id: "irrigation",
      label: "Irrigation",
      color: "#3B82F6",
      icon: <Droplets size={16} />,
    },
    {
      id: "market",
      label: "Market/Sales",
      color: "#8B5CF6",
      icon: <Tractor size={16} />,
    },
    {
      id: "soil",
      label: "Soil Management",
      color: "#EC4899",
      icon: <Shovel size={16} />,
    },
    {
      id: "weather",
      label: "Weather Event",
      color: "#6B7280",
      icon: <Cloud size={16} />,
    },
    {
      id: "planting",
      label: "Planting",
      color: "#34D399",
      icon: <Sprout size={16} />,
    },
    {
      id: "other",
      label: "Other",
      color: "#3B82F6",
      icon: <CalendarIcon size={16} />,
    },
  ];

  // Custom calendar event styling
  const eventStyleGetter = (event) => {
    const eventType =
      eventTypes.find((type) => type.id === event.type) ||
      eventTypes.find((type) => type.id === "other");

    const style = {
      backgroundColor: event.color || eventType.color,
      borderRadius: "4px",
      color: "white",
      border: "none",
      display: "block",
    };
    return {
      style,
    };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (name, date) => {
    setNewEvent({
      ...newEvent,
      [name]: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Show loading toast
      const loadingToastId = toast.info(
        "Adding event to your farm calendar...",
        {
          position: "top-right",
          autoClose: false,
          icon: <Sprout className="text-green-500" />,
        }
      );

      // Get the color based on the selected type
      const selectedType = eventTypes.find((type) => type.id === newEvent.type);
      const eventWithColor = {
        ...newEvent,
        color: selectedType.color,
      };

      let addedEvent;

      try {
        // Try to add the event to Google Calendar
        addedEvent = await addEventToGoogleCalendar(eventWithColor);
      } catch (error) {
        console.error("Error adding to Google Calendar:", error);

        // If Google Calendar fails, create a local event only
        addedEvent = {
          ...eventWithColor,
          id: `local-${Date.now()}`, // Generate a temporary local ID
          start: new Date(eventWithColor.start),
          end: new Date(eventWithColor.end),
        };
      }

      // Close the loading toast
      toast.dismiss(loadingToastId);

      // Success toast
      // toast.success("Farm event added successfully!", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   icon: <Sprout className="text-green-500" />,
      // });

      // If onEventsUpdate is provided, call it with the updated event list
      if (onEventsUpdate) {
        onEventsUpdate([...events, addedEvent]);
      }

      // Close the modal and reset form
      setShowEventModal(false);
      setNewEvent({
        title: "",
        start: new Date(),
        end: new Date(),
        allDay: false,
        resource: "",
        type: "other",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add farm event. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Color based on event type for legend
  const getEventTypeColor = (typeId) => {
    const foundType = eventTypes.find((type) => type.id === typeId);
    return foundType ? foundType.color : "#3B82F6";
  };

  // Get upcoming events (next 3 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + 3);

    return events
      .filter(
        (event) =>
          new Date(event.start) >= now &&
          new Date(event.start) <= threeDaysLater
      )
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 3);
  };

  // Format date for display
  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    return format(eventDate, "MMM d, h:mm a");
  };

  // Determine if the weather is suitable for field work
  const getWeatherSuitability = () => {
    if (!weatherData)
      return { suitable: true, message: "Weather data unavailable" };

    const condition = weatherData.condition.toLowerCase();
    const temp = weatherData.temp;
    const windSpeed = weatherData.windSpeed;

    // Check for rain or storm conditions
    if (
      condition.includes("rain") ||
      condition.includes("storm") ||
      condition.includes("shower")
    ) {
      return {
        suitable: false,
        message: "Not suitable for field work - precipitation detected",
      };
    }

    // Check for high winds
    if (windSpeed > 5.5) {
      // Above 5.5 m/s (~20 km/h) might be unsuitable for spraying
      return {
        suitable: false,
        message: "High winds may affect spraying/dust control",
      };
    }

    // Check for extreme temperatures
    if (temp > 35) {
      return {
        suitable: false,
        message: "High temperature - consider work during cooler hours",
      };
    }
    if (temp < 10) {
      return {
        suitable: false,
        message: "Low temperature - may affect equipment/crops",
      };
    }

    return {
      suitable: true,
      message: "Weather conditions favorable for field work",
    };
  };

  const weatherSuitability = getWeatherSuitability();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      {/* Header with tabs and weather */}
      <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sprout className="h-6 w-6" />
            <h1 className="text-xl font-bold">Farm Planner</h1>
          </div>
          <div className="flex space-x-3">
            <WeatherWidget
              weatherData={weatherData}
              isWeatherLoading={isWeatherLoading}
            />
            <button
              className="px-3 py-2 bg-white text-green-700 rounded-lg flex items-center space-x-1 shadow-sm hover:bg-green-50 transition-colors"
              onClick={() => setShowEventModal(true)}
            >
              <PlusCircle size={16} />
              <span>Add Farm Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar for calendar info */}
        <div className="p-4 border-r border-gray-100 lg:w-64 bg-gray-50">
          <div className="space-y-4">
            {/* Season progress */}
            <SeasonProgress />

            {/* Field work suitability based on weather */}
            <div
              className={`p-3 rounded-lg ${
                weatherSuitability.suitable ? "bg-green-50" : "bg-amber-50"
              }`}
            >
              <h3 className="font-medium text-sm mb-1 flex items-center">
                {weatherSuitability.suitable ? (
                  <Sun size={16} className="mr-1 text-green-500" />
                ) : (
                  <Cloud size={16} className="mr-1 text-amber-500" />
                )}
                Field Work Status
              </h3>
              <p className="text-xs text-gray-700">
                {weatherSuitability.message}
              </p>
            </div>

            {/* Weather alerts */}
            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Cloud size={16} className="mr-1 text-blue-500" />
                Weather Alerts
              </h3>
              <div className="space-y-2">
                {weatherAlerts.length > 0 ? (
                  weatherAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2 rounded border border-gray-200 text-xs"
                    >
                      <div className="font-medium">
                        {alert.type} • {alert.date}
                      </div>
                      <div className="text-gray-600">{alert.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">
                    No active weather alerts
                  </div>
                )}
              </div>
            </div>

            {/* Event type legend */}
            <div>
              <h3 className="font-medium text-sm mb-2">Event Types</h3>
              <div className="grid grid-cols-1 gap-1">
                {eventTypes.map((type) => (
                  <div key={type.id} className="flex items-center text-xs">
                    <div
                      className="mr-2 flex items-center justify-center"
                      style={{ color: type.color }}
                    >
                      {type.icon}
                    </div>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming events */}
            <div>
              <h3 className="font-medium text-sm mb-2">Upcoming Tasks</h3>
              <div className="space-y-2">
                {getUpcomingEvents().length > 0 ? (
                  getUpcomingEvents().map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2 rounded border border-gray-200 text-xs flex items-start"
                    >
                      <div
                        className="w-3 h-3 rounded-full mt-1 mr-2 flex-shrink-0"
                        style={{
                          backgroundColor: getEventTypeColor(event.type),
                        }}
                      ></div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-gray-600">
                          {formatEventDate(event.start)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">
                    No upcoming events
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main calendar area */}
        <div className="flex-1 p-4">
          {/* View selector */}
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-2">
              {["month", "week", "day", "agenda"].map((view) => (
                <button
                  key={view}
                  className={`px-3 py-1 text-sm rounded-lg capitalize transition-colors ${
                    selectedView === view
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {format(selectedDate, "MMMM yyyy")}
            </div>
          </div>

          {/* Calendar component */}
          <div className="h-screen max-h-[600px] rounded-lg overflow-hidden border border-gray-200">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day", "agenda"]}
              view={selectedView}
              onView={setSelectedView}
              date={selectedDate}
              onNavigate={setSelectedDate}
              dayPropGetter={(date) => {
                // Highlight today
                const today = new Date();
                if (
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear()
                ) {
                  return {
                    className: "bg-green-50",
                    style: {
                      borderRadius: "6px",
                    },
                  };
                }
                return {};
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Sprout size={18} className="mr-2 text-green-500" />
                  New Farm Task
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="E.g., Irrigate south field"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Task Type
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={newEvent.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10 transition-colors"
                    >
                      {eventTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={format(newEvent.start, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const newDate = parse(
                          e.target.value,
                          "yyyy-MM-dd",
                          new Date()
                        );
                        const newDateTime = new Date(
                          newDate.getFullYear(),
                          newDate.getMonth(),
                          newDate.getDate(),
                          newEvent.start.getHours(),
                          newEvent.start.getMinutes()
                        );
                        handleDateChange("start", newDateTime);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={format(newEvent.start, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const newDateTime = new Date(newEvent.start);
                        newDateTime.setHours(hours, minutes);
                        handleDateChange("start", newDateTime);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      disabled={newEvent.allDay}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={format(newEvent.end, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const newDate = parse(
                          e.target.value,
                          "yyyy-MM-dd",
                          new Date()
                        );
                        const newDateTime = new Date(
                          newDate.getFullYear(),
                          newDate.getMonth(),
                          newDate.getDate(),
                          newEvent.end.getHours(),
                          newEvent.end.getMinutes()
                        );
                        handleDateChange("end", newDateTime);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={format(newEvent.end, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const newDateTime = new Date(newEvent.end);
                        newDateTime.setHours(hours, minutes);
                        handleDateChange("end", newDateTime);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      disabled={newEvent.allDay}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="allDay"
                      checked={newEvent.allDay}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">All Day Task</span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Notes/Details
                  </label>
                  <textarea
                    name="resource"
                    value={newEvent.resource}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    rows="3"
                    placeholder="Enter any additional details about this farm task..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Sprout size={16} className="mr-1" />
                    Save Farm Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarView;
