# import requests

# latitude = 11.3410  # Mumbai latitude
# longitude = 77.7172  # Mumbai longitude
# start_date = '20241201'  # Start date in YYYYMMDD format
# end_date = '20241207'    # End date in YYYYMMDD format

# url = (
#     f"https://power.larc.nasa.gov/api/temporal/daily/point?"
#     f"parameters=PRECTOTCORR&community=AG&longitude={longitude}&latitude={latitude}"
#     f"&start={start_date}&end={end_date}&format=JSON"
# )

# response = requests.get(url)
# data = response.json()

# # Extracting rainfall data
# if 'properties' in data:
#     rainfall_data = data['properties']['parameter'].get('PRECTOTCORR', {})
#     if rainfall_data:
#         print("Rainfall data (mm/day):")
#         for date, rainfall in rainfall_data.items():
#             print(f"Date: {date}, Rainfall: {rainfall} mm")
#     else:
#         print("No rainfall data found for 'PRECTOTCORR'.")
# else:
#     print("Error in response data:", data)

# import requests

# api_key = '1172476f50624984850114232250203'
# latitude = 28.6315    # Example for Erode, Tamil Nadu
# longitude = 77.2167
# days = 1  # Number of days of forecast (1 to 14)

# # Using latitude and longitude as input for the query
# url = f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={latitude},{longitude}&days={days}&alerts=yes"

# response = requests.get(url)
# if response.status_code == 200:
#     data = response.json()
    
#     # 🌍 Location Information
#     location_data = data['location']
#     print(f"\n📍 Location: {location_data['name']}, {location_data['region']}, {location_data['country']}")
#     print(f"🕒 Local Time: {location_data['localtime']}\n")
    
#     # ⛅ Forecast Information
#     forecast_data = data['forecast']['forecastday']
#     for day in forecast_data:
#         print(f"📅 Date: {day['date']}")
#         print(f"🌡️ Max Temp: {day['day']['maxtemp_c']}°C")
#         print(f"🌡️ Min Temp: {day['day']['mintemp_c']}°C")
#         print(f"🌦️ Condition: {day['day']['condition']['text']}")
#         print(f"🌧️ Chance of Rain: {day['day']['daily_chance_of_rain']}%")
#         print(f"💨 Max Wind: {day['day']['maxwind_kph']} kph\n")
    
#     # 🚨 Weather Alerts (if any)
#     if 'alerts' in data and data['alerts']['alert']:
#         print("🚨 Weather Alerts:")
#         for alert in data['alerts']['alert']:
#             print(f"📢 Alert: {alert['headline']}")
#             print(f"🕒 Effective: {alert['effective']}")
#             print(f"⏲️ Expires: {alert['expires']}")
#             print(f"📄 Description: {alert['desc']}\n")
#     else:
#         print("✅ No Weather Alerts for the selected location and time period.")
# else:
#     print(f"❌ Failed to fetch data. HTTP Status Code: {response.status_code}")


#---------------------------------------------------------------------
# import requests
# import json

# # 🔑 Your WeatherAPI Key
# api_key = '1172476f50624984850114232250203'

# # 📍 Latitude and Longitude for Connaught Place, Delhi
# latitude = 28.6315
# longitude = 77.2167

# # 🌐 API Endpoint with Forecast and Alerts Enabled
# url = f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={latitude},{longitude}&days=3&alerts=yes&aqi=yes"

# # 📨 API Request
# response = requests.get(url)

# if response.status_code == 200:
#     data = response.json()

#     # 🎯 Pretty print the full JSON response to explore all available data
#     print(json.dumps(data, indent=4))

#     print("\n🟢 Extracting All Available Weather Information...\n")

#     # 🌍 Location Details
#     location = data['location']
#     print(f"📍 Location: {location['name']}, {location['region']}, {location['country']}")
#     print(f"🕒 Local Time: {location['localtime']}")
#     print(f"🧭 Latitude: {location['lat']}, Longitude: {location['lon']}")
#     print(f"🌐 Timezone: {location['tz_id']}\n")

#     # 🌦️ Current Weather
#     current = data['current']
#     print("🌡️ Current Weather:")
#     print(f"🌡️ Temperature: {current['temp_c']}°C")
#     print(f"🌡️ Feels Like: {current['feelslike_c']}°C")
#     print(f"🌥️ Condition: {current['condition']['text']}")
#     print(f"💧 Humidity: {current['humidity']}%")
#     print(f"🌬️ Wind Speed: {current['wind_kph']} kph")
#     print(f"🧭 Wind Direction: {current['wind_dir']}")
#     print(f"📈 Pressure: {current['pressure_mb']} mb")
#     print(f"🌫️ Visibility: {current['vis_km']} km")
#     print(f"☁️ Cloud Cover: {current['cloud']}%")
#     print(f"☀️ UV Index: {current['uv']}")
#     print(f"🌡️ Dew Point: {current['dewpoint_c']}°C\n")

#     # 🔮 Forecast Details
#     forecast = data['forecast']['forecastday']
#     for day in forecast:
#         print(f"📅 Date: {day['date']}")
#         print(f"🌡️ Max Temp: {day['day']['maxtemp_c']}°C")
#         print(f"🌡️ Min Temp: {day['day']['mintemp_c']}°C")
#         print(f"🌦️ Condition: {day['day']['condition']['text']}")
#         print(f"🌧️ Precipitation: {day['day']['totalprecip_mm']} mm")
#         print(f"🌬️ Max Wind: {day['day']['maxwind_kph']} kph")
#         print(f"🌄 Sunrise: {day['astro']['sunrise']}")
#         print(f"🌇 Sunset: {day['astro']['sunset']}")

#         # 🔍 Hourly Data
#         print("\n🕒 Hourly Forecast:")
#         for hour in day['hour']:
#             print(f"🕒 Time: {hour['time']}")
#             print(f"🌡️ Temp: {hour['temp_c']}°C")
#             print(f"🌥️ Condition: {hour['condition']['text']}")
#             print(f"🌧️ Precipitation: {hour['precip_mm']} mm")
#             print(f"💧 Humidity: {hour['humidity']}%")
#             print(f"🌬️ Wind Speed: {hour['wind_kph']} kph\n")
#         print("--------------------------------------------------\n")

#     # 🚨 Weather Alerts (if any)
#     if 'alerts' in data and data['alerts']['alert']:
#         print("🚨 Weather Alerts:")
#         for alert in data['alerts']['alert']:
#             print(f"📢 Alert: {alert['headline']}")
#             print(f"🕒 Effective: {alert['effective']}")
#             print(f"⏲️ Expires: {alert['expires']}")
#             print(f"📄 Description: {alert['desc']}\n")
#     else:
#         print("✅ No Weather Alerts for the selected location and time period.")
# else:
#     print(f"❌ Failed to fetch data. HTTP Status Code: {response.status_code}")



#---------------------------------------------------------------------

import requests
from fastapi import APIRouter

router = APIRouter()

@router.get("/environmental_conditions")
def get_weather_conditions(latitude: float, longitude: float):
    api_key = '1172476f50624984850114232250203'
    url = f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={latitude},{longitude}&days=3&alerts=yes&aqi=yes"

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        # Extracting full data for internal use (logging, debugging, etc.)
        full_data = {
            "location": data.get('location'),
            "current_weather": data.get('current'),
            "forecast": data.get('forecast'),
            "alerts": data.get('alerts')
        }

        # Extracting specific data to send to frontend (Temperature, Humidity, and Rainfall)
        current = data['current']
        forecast = data['forecast']['forecastday']

        # Prepare data to send to the frontend
        frontend_data = {
            "temperature": current['temp_c'],  # Current temperature in Celsius
            "humidity": current['humidity'],   # Current humidity percentage
            "rainfall": 0  # Default rainfall value
        }

        # Loop through the forecast to get daily rainfall (precipitation)
        for day in forecast:
            daily_rainfall = day['day']['totalprecip_mm']  # Total precipitation for the day
            frontend_data["rainfall"] += daily_rainfall  # Accumulate daily rainfall

        return frontend_data

    else:
        return {"error": f"Failed to fetch weather data. Status code: {response.status_code}"}

