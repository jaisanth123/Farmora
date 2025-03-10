import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
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
  FaLeaf,
  FaBug,
  FaSeedling,
  FaWater,
} from "react-icons/fa";
import { format } from "date-fns";
import ChatbotWrapper from "../dashboard/utils/ChatbotWrapper";

const WeatherForecast = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [location, setLocation] = useState("Delhi"); // Set Delhi as default location
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchType, setSearchType] = useState("location");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    // Fetch Delhi weather by default instead of relying on geolocation
    fetchWeatherByLocation("Erode,India");

    // Still try to get user's location if available
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ lat, lon });

        // Don't automatically fetch weather based on current location
        // Just store the coordinates for later use
      },
      (error) => {
        console.log("Geolocation error:", error);
        // No need to set error as we're using Delhi by default
      }
    );
  }, []);

  const fetchWeatherByCoordinates = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = "1172476f50624984850114232250203";

      // Fetch current weather
      const currentResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
      );

      // Fetch forecast data (7 days)
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no`
      );

      processWeatherData(currentResponse.data, forecastResponse.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please try again.");
      setLoading(false);
      // Use mock data if API fetch fails
      useMockData();
    }
  };

  const fetchWeatherByLocation = async (locationName) => {
    setLoading(true);
    setError(null);

    try {
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
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(
        "Failed to fetch weather data. Please try again or use coordinates."
      );
      setLoading(false);
      // Use mock data if API fetch fails
      useMockData();
    }
  };

  const useMockData = () => {
    // Mock current weather data
    const mockCurrentData = {
      location: {
        name: "Delhi", // Changed from Chennai to Delhi
        country: "India",
      },
      current: {
        temp_c: 32, // Updated temperature for Delhi
        condition: {
          text: "Sunny",
          icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
        },
        humidity: 55, // Updated for Delhi
        wind_kph: 12.5,
        precip_mm: 0,
        feelslike_c: 34, // Updated for Delhi
      },
    };

    // Mock forecast data
    const mockForecastData = {
      forecast: {
        forecastday: [
          {
            date: new Date().toISOString(),
            day: {
              maxtemp_c: 36, // Updated for Delhi
              mintemp_c: 26, // Updated for Delhi
              condition: {
                text: "Sunny",
                icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
              },
              daily_chance_of_rain: 0,
              avghumidity: 55, // Updated for Delhi
            },
            hour: Array(24)
              .fill()
              .map((_, i) => ({
                time: `${new Date().toISOString().split("T")[0]}T${
                  i < 10 ? "0" + i : i
                }:00:00`,
                temp_c: 32 + Math.sin(i / 3) * 5, // Updated base temp for Delhi
                condition: {
                  text: i > 6 && i < 18 ? "Sunny" : "Clear",
                  icon:
                    i > 6 && i < 18
                      ? "//cdn.weatherapi.com/weather/64x64/day/113.png"
                      : "//cdn.weatherapi.com/weather/64x64/night/113.png",
                },
              })),
          },
          ...Array(6)
            .fill()
            .map((_, i) => ({
              date: new Date(
                Date.now() + (i + 1) * 24 * 60 * 60 * 1000
              ).toISOString(),
              day: {
                maxtemp_c: 36 + Math.sin(i) * 3, // Updated for Delhi
                mintemp_c: 26 + Math.sin(i) * 2, // Updated for Delhi
                condition: {
                  text: [
                    "Sunny",
                    "Partly cloudy",
                    "Cloudy",
                    "Light rain",
                    "Sunny",
                    "Partly cloudy",
                  ][i],
                  icon: [
                    `//cdn.weatherapi.com/weather/64x64/day/113.png`,
                    `//cdn.weatherapi.com/weather/64x64/day/116.png`,
                    `//cdn.weatherapi.com/weather/64x64/day/119.png`,
                    `//cdn.weatherapi.com/weather/64x64/day/296.png`,
                    `//cdn.weatherapi.com/weather/64x64/day/113.png`,
                    `//cdn.weatherapi.com/weather/64x64/day/116.png`,
                  ][i],
                },
                daily_chance_of_rain: [0, 10, 30, 70, 10, 20][i],
                avghumidity: 55 + Math.sin(i) * 10, // Updated base humidity for Delhi
              },
            })),
        ],
      },
    };

    processWeatherData(mockCurrentData, mockForecastData);
  };

  const processWeatherData = (currentData, forecastData) => {
    // Set current weather data
    const currentWeather = {
      temp: Math.round(currentData.current.temp_c),
      condition: currentData.current.condition.text,
      icon: currentData.current.condition.icon,
      humidity: currentData.current.humidity,
      wind_speed: Math.round((currentData.current.wind_kph / 3.6) * 10) / 10, // Convert km/h to m/s with 1 decimal
      feels_like: Math.round(currentData.current.feelslike_c),
      precipitation:
        forecastData.forecast.forecastday[0].day.daily_chance_of_rain || 0,
      location: `${currentData.location.name}, ${currentData.location.country}`,
    };

    // Process daily forecast
    const dailyForecast = forecastData.forecast.forecastday.map((day) => ({
      day: format(new Date(day.date), "EEE"),
      temp_max: Math.round(day.day.maxtemp_c),
      temp_min: Math.round(day.day.mintemp_c),
      weather: day.day.condition.text,
      weather_icon: day.day.condition.icon,
      precipitation: day.day.daily_chance_of_rain,
      humidity: day.day.avghumidity,
    }));

    // Process hourly forecast (next 6 intervals)
    const currentHour = new Date().getHours();
    const hourlyIntervals = [0, 3, 6, 9, 12, 15];
    const hourlyForecast = hourlyIntervals.map((interval) => {
      const hourIndex = Math.floor((currentHour + interval) / 3) % 8;
      const displayHour = (currentHour + interval) % 24;
      const timeString =
        displayHour === currentHour
          ? "Now"
          : displayHour === 0
          ? "12 AM"
          : displayHour === 12
          ? "12 PM"
          : displayHour < 12
          ? `${displayHour} AM`
          : `${displayHour - 12} PM`;

      const todayHours = forecastData.forecast.forecastday[0].hour;
      const hourData = todayHours[(currentHour + interval) % 24];

      return {
        time: timeString,
        temp: Math.round(hourData.temp_c),
        weather_icon: hourData.condition.icon,
      };
    });

    // Calculate agricultural metrics based on weather data
    const soilMoisture = calculateSoilMoisture(
      currentWeather.precipitation,
      forecastData
    );
    const idealCrops = getIdealCrops(
      currentWeather.temp,
      currentWeather.precipitation,
      forecastData
    );
    const irrigationAdvice = getIrrigationAdvice(
      currentWeather.temp,
      currentWeather.precipitation,
      forecastData
    );
    const pestRisk = getPestRisk(
      currentWeather.temp,
      currentWeather.humidity,
      forecastData
    );

    const processedData = {
      current: currentWeather,
      daily: dailyForecast,
      hourly: hourlyForecast,
      agricultural_metrics: {
        soil_moisture: soilMoisture,
        ideal_crops: idealCrops,
        irrigation_advice: irrigationAdvice,
        pest_risk: pestRisk,
      },
    };

    setWeatherData(processedData);
    setForecastData(dailyForecast);
    setLoading(false);
  };

  // Helper functions for agricultural metrics
  const calculateSoilMoisture = (precipitation, forecast) => {
    const nextFewDaysRain =
      forecast.forecast.forecastday
        .slice(0, 3)
        .reduce((sum, day) => sum + day.day.daily_chance_of_rain, 0) / 3;

    if (nextFewDaysRain > 60) return "High";
    if (nextFewDaysRain > 30) return "Moderate";
    return "Low";
  };

  const getIdealCrops = (temp, precipitation, forecast) => {
    const avgTemp =
      forecast.forecast.forecastday
        .slice(0, 3)
        .reduce(
          (sum, day) => sum + (day.day.maxtemp_c + day.day.mintemp_c) / 2,
          0
        ) / 3;

    const rainPrediction =
      forecast.forecast.forecastday
        .slice(0, 3)
        .reduce((sum, day) => sum + day.day.daily_chance_of_rain, 0) / 3;

    if (avgTemp > 28 && rainPrediction > 50)
      return ["Rice", "Sugarcane", "Cotton"];
    if (avgTemp > 20 && avgTemp <= 28) return ["Wheat", "Millet", "Corn"];
    if (avgTemp <= 20) return ["Barley", "Potatoes", "Peas"];
    return ["Millet", "Sorghum", "Corn"];
  };

  const getIrrigationAdvice = (temp, precipitation, forecast) => {
    const rainPrediction =
      forecast.forecast.forecastday
        .slice(0, 3)
        .reduce((sum, day) => sum + day.day.daily_chance_of_rain, 0) / 3;

    if (rainPrediction > 60)
      return "No irrigation needed due to sufficient rainfall forecast";
    if (temp > 30)
      return "Frequent irrigation recommended due to high temperatures";
    return "Regular irrigation recommended based on soil moisture levels";
  };

  const getPestRisk = (temp, humidity, forecast) => {
    const avgHumidity =
      forecast.forecast.forecastday
        .slice(0, 3)
        .reduce((sum, day) => sum + day.day.avghumidity, 0) / 3;

    if (temp > 28 && avgHumidity > 70) return "High";
    if (temp > 25 && avgHumidity > 60) return "Moderate";
    return "Low";
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
  const getWeatherIcon = (iconUrl, size = 24) => {
    if (iconUrl) {
      return (
        <img src={iconUrl} alt="Weather icon" width={size} height={size} />
      );
    }

    // Fallback icons if URL is not available
    const iconName = iconUrl || "default";

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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {weatherData.current.location}
                    </h2>
                    <p className="text-sm opacity-90">Today's Weather</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      {getWeatherIcon(weatherData.current.icon, 48)}
                      <span className="text-4xl ml-3 font-bold">
                        {weatherData.current.temp}°C
                      </span>
                    </div>
                    <p className="mt-1">{weatherData.current.condition}</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <FaTemperatureHigh className="text-red-500 mr-2 text-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Feels Like</p>
                      <p className="font-medium text-lg">
                        {weatherData.current.feels_like}°C
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaTint className="text-blue-500 mr-2 text-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-medium text-lg">
                        {weatherData.current.humidity}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaWind className="text-blue-400 mr-2 text-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p className="font-medium text-lg">
                        {weatherData.current.wind_speed} m/s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaUmbrella className="text-blue-700 mr-2 text-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Chance of Rain</p>
                      <p
                        className={`font-medium text-lg ${getPrecipitationColor(
                          weatherData.current.precipitation
                        )}`}
                      >
                        {weatherData.current.precipitation}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hourly forecast */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-4 mb-6"
            >
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                Hourly Forecast
              </h3>
              <div className="flex overflow-x-auto pb-2 space-x-8">
                {weatherData.hourly.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center min-w-[60px]"
                  >
                    <p className="text-sm text-gray-600 mb-1">{hour.time}</p>
                    {getWeatherIcon(hour.weather_icon, 36)}
                    <p className="font-medium mt-1 text-lg">{hour.temp}°C</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 7-day forecast */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-4 mb-6"
            >
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                7-Day Forecast
              </h3>
              <div className="space-y-3">
                {weatherData.daily.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-20">
                      <p
                        className={
                          index === 0
                            ? "font-semibold text-gray-800"
                            : "text-gray-600"
                        }
                      >
                        {day.day}
                      </p>
                    </div>
                    <div className="flex items-center w-14">
                      {getWeatherIcon(day.weather_icon, 30)}
                    </div>
                    <div className="w-32">
                      <p className="text-sm text-gray-800">{day.weather}</p>
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
                      <span className="text-red-500 font-medium">
                        {day.temp_max}°
                      </span>
                      <span className="text-blue-500 font-medium">
                        {day.temp_min}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Agricultural impacts section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-5"
            >
              <h3 className="text-lg font-medium mb-4 text-gray-800">
                Agricultural Impacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <FaWater className="mr-2" /> Soil Moisture
                  </h4>
                  <p className="text-gray-700">
                    {weatherData.agricultural_metrics.soil_moisture}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on recent rainfall and forecast
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <FaLeaf className="mr-2" /> Irrigation Advice
                  </h4>
                  <p className="text-gray-700">
                    {weatherData.agricultural_metrics.irrigation_advice}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Consider adjusting based on crop type
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <FaSeedling className="mr-2" /> Recommended Crops
                  </h4>
                  <p className="text-gray-700">
                    {weatherData.agricultural_metrics.ideal_crops.join(", ")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on current weather patterns
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <FaBug className="mr-2" /> Pest Risk
                  </h4>
                  <p className="text-gray-700">
                    {weatherData.agricultural_metrics.pest_risk}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitor fields regularly in current conditions
                  </p>
                </div>
              </div>
            </motion.div>
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
