# import requests

# place = "Vellode ,Erode, Tamil Nadu, India"
# url = f"https://nominatim.openstreetmap.org/search?format=json&q={place}"

# # Add a custom User-Agent header
# headers = {
#     'User-Agent': 'MyAppName/1.0 (myemail@example.com)'
# }

# response = requests.get(url, headers=headers)

# if response.status_code == 200:
#     try:
#         data = response.json()
#         if data:
#             latitude = data[0]['lat']
#             longitude = data[0]['lon']
#             print(f"Latitude: {latitude}, Longitude: {longitude}")
#         else:
#             print("No data found for the specified location.")
#     except requests.exceptions.JSONDecodeError:
#         print("Error: The response is not in JSON format.")
#         print("Response Content:", response.text)
# else:
#     print(f"Failed to fetch data. Status code: {response.status_code}")
#     print("Response Content:", response.text)


import requests
from fastapi import APIRouter

router = APIRouter()

@router.get("/coordinates")
def get_coordinates(place: str):
    # Using OpenStreetMap Nominatim API for geocoding
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={place}"
    
    # Custom User-Agent header to avoid blocking
    headers = {
        'User-Agent': 'WeatherApp/1.0 (myemail@example.com)'
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        try:
            data = response.json()
            if data:
                #print(data)
                latitude = data[0]['lat']
                longitude = data[0]['lon']
                print(latitude, longitude)
                return {"latitude": latitude, "longitude": longitude}
            else:
                return {"error": "No data found for the specified location."}
        except requests.exceptions.JSONDecodeError:
            return {"error": "Error decoding the JSON response."}
    else:
        return {"error": f"Failed to fetch data. Status code: {response.status_code}"}
