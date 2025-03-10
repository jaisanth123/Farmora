import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCloudSun,
  FaMapMarkerAlt,
  FaTemperatureHigh,
  FaWind,
  FaTint,
  FaSearchLocation,
  FaUmbrella,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaBolt,
  FaSnowflake,
  FaSmog,
} from "react-icons/fa";
import axios from "axios";
import ChatbotWrapper from "../dashboard/utils/ChatbotWrapper";

const WeatherForecast = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchType, setSearchType] = useState("location"); // "location" or "coordinates"
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location when component mounts
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ lat, lon });

        // Automatically fetch weather based on current location
        fetchWeatherByCoordinates(lat, lon);
      },
      (error) => {
        console.log("Geolocation error:", error);
        setLoading(false);
        setError(
          "Unable to get your location. Please enter a location manually."
        );
      }
    );
  }, []);

  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/environmental_conditions?latitude=${lat}&longitude=${lon}`
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      processWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please try again.");
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (locationName) => {
    setLoading(true);
    setError(null);

    // First, we need to convert the location name to coordinates
    // We'll use a mock implementation for demonstration
    // In a real implementation, you would use a geocoding service or API endpoint

    try {
      // This is a mock implementation - in reality, you would make an API call to a geocoding service
      // or create a backend endpoint for this purpose

      // Simulate a geocoding API call
      let lat, lon;

      // Mock coordinates for some common cities (for demo purposes)
      if (locationName.toLowerCase().includes("delhi")) {
        lat = 28.6139;
        lon = 77.209;
      } else if (locationName.toLowerCase().includes("mumbai")) {
        lat = 19.076;
        lon = 72.8777;
      } else if (locationName.toLowerCase().includes("bangalore")) {
        lat = 12.9716;
        lon = 77.5946;
      } else {
        // For other locations, we could use a random location or return an error
        // In a real app, you'd use a geocoding service
        throw new Error(
          "Location not found. Please try a major city or use coordinates."
        );
      }

      // Now fetch weather using the coordinates
      await fetchWeatherByCoordinates(lat, lon);
    } catch (error) {
      console.error("Error converting location to coordinates:", error);
      setError(
        error.message ||
          "Failed to find location. Please try using coordinates instead."
      );
      setLoading(false);
    }
  };

  const processWeatherData = (data) => {
    // Convert API data to the format our component expects
    // In this case, we're adapting the simple API response to our more complex UI format

    // Extract temperature, humidity, and rainfall from API response
    const { temperature, humidity, rainfall } = data;

    // Create a more detailed weather object that our UI can use
    const processedData = {
      current: {
        temp: temperature,
        feels_like: temperature, // Assuming the API doesn't provide "feels like" data
        humidity: humidity,
        wind_speed: 0, // API doesn't provide wind speed in your example
        weather: getWeatherDescription(temperature, humidity, rainfall),
        weather_icon: getWeatherIconName(temperature, humidity, rainfall),
        precipitation: rainfall > 0 ? 100 : 0, // Simple logic for precipitation chance
        uv_index: 0, // API doesn't provide UV index in your example
      },
      daily: generateDailyForecast(temperature, humidity, rainfall),
      hourly: generateHourlyForecast(temperature),
      agricultural_metrics: {
        soil_moisture:
          rainfall > 10 ? "High" : rainfall > 5 ? "Moderate" : "Low",
        ideal_crops: getIdealCrops(temperature, rainfall),
        irrigation_advice: getIrrigationAdvice(temperature, rainfall),
        pest_risk: getPestRisk(temperature, humidity),
      },
    };

    setWeatherData(processedData);
    setLoading(false);
  };

  // Helper functions to generate weather descriptions based on available data
  const getWeatherDescription = (temp, humidity, rainfall) => {
    if (rainfall > 10) return "Heavy Rain";
    if (rainfall > 0) return "Light Rain";
    if (humidity > 80) return "Cloudy";
    if (temp > 30) return "Hot";
    if (temp < 10) return "Cold";
    return "Clear";
  };

  const getWeatherIconName = (temp, humidity, rainfall) => {
    if (rainfall > 10) return "cloud-rain";
    if (rainfall > 0) return "cloud-rain";
    if (humidity > 80) return "cloud";
    if (temp > 30) return "sun";
    if (temp < 10) return "snow";
    return "cloud-sun";
  };

  const getIdealCrops = (temp, rainfall) => {
    if (temp > 25 && rainfall > 5) return ["Rice", "Sugarcane", "Cotton"];
    if (temp > 20) return ["Wheat", "Millet", "Corn"];
    return ["Barley", "Potatoes", "Peas"];
  };

  const getIrrigationAdvice = (temp, rainfall) => {
    if (rainfall > 10) return "No irrigation needed due to sufficient rainfall";
    if (temp > 30)
      return "Frequent irrigation recommended due to high temperatures";
    return "Regular irrigation recommended";
  };

  const getPestRisk = (temp, humidity) => {
    if (temp > 25 && humidity > 70) return "High";
    if (temp > 20 && humidity > 60) return "Moderate";
    return "Low";
  };

  // Generate mock daily forecast based on current conditions
  const generateDailyForecast = (temp, humidity, rainfall) => {
    const days = ["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecast = [];

    for (let i = 0; i < 7; i++) {
      // Simple algorithm to vary the forecast slightly each day
      const variation = Math.sin(i) * 3;
      const dayTemp = Math.round(temp + variation);
      const dayRainfall = Math.max(0, rainfall - i * 0.5);
      const dayHumidity = Math.max(30, humidity - i * 2);

      forecast.push({
        day: days[i],
        temp_max: dayTemp + 2,
        temp_min: dayTemp - 3,
        weather: getWeatherDescription(dayTemp, dayHumidity, dayRainfall),
        weather_icon: getWeatherIconName(dayTemp, dayHumidity, dayRainfall),
        precipitation: dayRainfall > 0 ? Math.round(dayRainfall * 10) : 0,
      });
    }

    return forecast;
  };

  // Generate mock hourly forecast based on current temperature
  const generateHourlyForecast = (temp) => {
    const hours = ["Now", "12 PM", "3 PM", "6 PM", "9 PM", "12 AM"];
    const forecast = [];

    for (let i = 0; i < hours.length; i++) {
      const hourVariation = Math.cos(i) * 2;
      const hourTemp = Math.round(temp + hourVariation);
      const icon = i < 3 ? "sun" : i < 5 ? "cloud-sun" : "cloud";

      forecast.push({
        time: hours[i],
        temp: hourTemp,
        weather_icon: icon,
      });
    }

    return forecast;
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleLatitudeChange = (e) => {
    setLatitude(e.target.value);
  };

  const handleLongitudeChange = (e) => {
    setLongitude(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchType === "coordinates") {
      if (!latitude || !longitude) {
        setError("Please enter both latitude and longitude values.");
        return;
      }

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) {
        setError("Please enter valid numeric values for coordinates.");
        return;
      }

      fetchWeatherByCoordinates(lat, lon);
    } else {
      if (!location) {
        setError("Please enter a location name.");
        return;
      }

      fetchWeatherByLocation(location);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      fetchWeatherByCoordinates(userLocation.lat, userLocation.lon);
      setSearchType("coordinates");
      setLatitude(userLocation.lat.toString());
      setLongitude(userLocation.lon.toString());
    }
  };

  // Function to get the appropriate weather icon
  const getWeatherIcon = (iconName, size = 24) => {
    switch (iconName) {
      case "sun":
        return <FaSun size={size} className="text-yellow-500" />;
      case "cloud-sun":
        return <FaCloudSun size={size} className="text-blue-400" />;
      case "cloud":
        return <FaCloud size={size} className="text-gray-400" />;
      case "cloud-rain":
        return <FaCloudRain size={size} className="text-blue-600" />;
      case "bolt":
        return <FaBolt size={size} className="text-yellow-600" />;
      case "snow":
        return <FaSnowflake size={size} className="text-blue-200" />;
      case "fog":
        return <FaSmog size={size} className="text-gray-300" />;
      default:
        return <FaCloudSun size={size} className="text-blue-400" />;
    }
  };
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  // Function to get color for precipitation chances
  const getPrecipitationColor = (chance) => {
    if (chance <= 20) return "text-green-500";
    if (chance <= 50) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaCloudSun size={48} className="text-blue-400 animate-pulse mb-4" />
        <p className="text-gray-600">Loading weather forecast...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          <FaCloudSun className="mr-2 text-blue-500" /> Weather Forecast
        </h1>

        {/* Search type toggle */}
        <div className="mb-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 rounded-lg transition-colors ${
                searchType === "location"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSearchType("location")}
            >
              Search by Location
            </button>
            <button
              className={`py-2 px-4 rounded-lg transition-colors ${
                searchType === "coordinates"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSearchType("coordinates")}
            >
              Search by Coordinates
            </button>
          </div>
        </div>

        {/* Location search */}
        <form onSubmit={handleSearch} className="mb-6">
          {searchType === "location" ? (
            <div className="flex items-center">
              <div className="relative flex-grow">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter city, district, state..."
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-r-lg hover:bg-green-600 transition-colors"
              >
                <FaSearchLocation />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="relative flex-grow mr-2">
                  <input
                    type="text"
                    value={latitude}
                    onChange={handleLatitudeChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Latitude (e.g. 28.6139)"
                  />
                </div>
                <div className="relative flex-grow mr-2">
                  <input
                    type="text"
                    value={longitude}
                    onChange={handleLongitudeChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Longitude (e.g. 77.2090)"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaSearchLocation />
                </button>
              </div>
            </div>
          )}

          {userLocation && (
            <button
              type="button"
              className="mt-2 text-sm text-green-600 hover:underline flex items-center"
              onClick={handleUseCurrentLocation}
            >
              <FaMapMarkerAlt className="mr-1" size={12} />
              Use my current location
            </button>
          )}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>

        {weatherData && (
          <>
            {/* Current weather card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r bg-black text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {location || (userLocation ? "Your Location" : "Weather")}
                    </h2>
                    <p className="text-sm opacity-90">Current Weather</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      {getWeatherIcon(weatherData.current.weather_icon, 32)}
                      <span className="text-3xl ml-2">
                        {weatherData.current.temp}°C
                      </span>
                    </div>
                    <p>{weatherData.current.weather}</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <FaTemperatureHigh className="text-red-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Feels Like</p>
                      <p className="font-medium">
                        {weatherData.current.feels_like}°C
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaTint className="text-blue-300 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-medium">
                        {weatherData.current.humidity}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaWind className="text-blue-300 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p className="font-medium">
                        {weatherData.current.wind_speed} km/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaUmbrella className="text-blue-700 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Precipitation</p>
                      <p className="font-medium">
                        {weatherData.current.precipitation}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly forecast */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">Hourly Forecast</h3>
              <div className="flex overflow-x-auto pb-2 space-x-4">
                {weatherData.hourly.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center min-w-[60px]"
                  >
                    <p className="text-sm text-gray-500">{hour.time}</p>
                    {getWeatherIcon(hour.weather_icon)}
                    <p className="font-medium">{hour.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-day forecast */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-medium mb-3">7-Day Forecast</h3>
              <div className="space-y-3">
                {weatherData.daily.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-20">
                      <p
                        className={
                          index === 0 ? "font-medium" : "text-gray-500"
                        }
                      >
                        {day.day}
                      </p>
                    </div>
                    <div className="flex items-center w-14">
                      {getWeatherIcon(day.weather_icon)}
                    </div>
                    <div className="w-32">
                      <p className="text-sm">{day.weather}</p>
                    </div>
                    <div className="w-24 text-center">
                      <p
                        className={`text-sm ${getPrecipitationColor(
                          day.precipitation
                        )}`}
                      >
                        {day.precipitation}%{" "}
                        <FaTint size={10} className="inline" />
                      </p>
                    </div>
                    <div className="flex items-center justify-end space-x-2 w-24">
                      <span className="text-red-500">{day.temp_max}°</span>
                      <span className="text-blue-500">{day.temp_min}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agricultural impacts section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium mb-3">Agricultural Impacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-700 mb-2">
                    Soil Moisture
                  </h4>
                  <p>{weatherData.agricultural_metrics.soil_moisture}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-700 mb-2">
                    Irrigation Advice
                  </h4>
                  <p>{weatherData.agricultural_metrics.irrigation_advice}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-700 mb-2">
                    Recommended Crops
                  </h4>
                  <p>
                    {weatherData.agricultural_metrics.ideal_crops.join(", ")}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-700 mb-2">Pest Risk</h4>
                  <p>{weatherData.agricultural_metrics.pest_risk}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
      <ChatbotWrapper
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        setIsChatOpen={setIsChatOpen}
      />
    </div>
  );
};

export default WeatherForecast;
