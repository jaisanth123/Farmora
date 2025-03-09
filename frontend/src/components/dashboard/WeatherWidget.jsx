import React from "react";
import Card from "../common/Card";
import {
  FaCloudSun,
  FaCloudRain,
  FaWind,
  FaThermometerHalf,
  FaTint,
} from "react-icons/fa";

const WeatherWidget = () => {
  // In a real app, this would be fetched from a weather API
  const weatherData = {
    current: {
      temp: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      rainChance: 20,
    },
    forecast: [
      { day: "Today", temp: 28, icon: <FaCloudSun /> },
      { day: "Tue", temp: 29, icon: <FaCloudSun /> },
      { day: "Wed", temp: 27, icon: <FaCloudRain /> },
      { day: "Thu", temp: 26, icon: <FaCloudRain /> },
      { day: "Fri", temp: 28, icon: <FaCloudSun /> },
    ],
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Local Weather</h2>
        <span className="text-xs text-gray-500">Your Farm, District</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaCloudSun className="text-4xl text-yellow-500 mr-3" />
          <div>
            <span className="text-3xl font-bold">
              {weatherData.current.temp}°C
            </span>
            <p className="text-gray-600">{weatherData.current.condition}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
            <FaTint className="mr-1" />
            <span>{weatherData.current.humidity}% Humidity</span>
          </div>
          <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
            <FaWind className="mr-1" />
            <span>{weatherData.current.windSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-end text-sm text-gray-600">
            <FaCloudRain className="mr-1" />
            <span>{weatherData.current.rainChance}% Chance of Rain</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between text-sm">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="font-medium">{day.day}</div>
              <div className="my-1 text-center flex justify-center">
                {day.icon}
              </div>
              <div>{day.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p className="font-medium">Farm Advisory:</p>
        <p>
          Good conditions for spraying over the next 2 days. Rain expected on
          Wednesday - schedule irrigation accordingly.
        </p>
      </div>
    </Card>
  );
};

export default WeatherWidget;
