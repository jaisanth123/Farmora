import requests

place = "Vellode ,Erode, Tamil Nadu, India"
url = f"https://nominatim.openstreetmap.org/search?format=json&q={place}"

# Add a custom User-Agent header
headers = {
    'User-Agent': 'MyAppName/1.0 (myemail@example.com)'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    try:
        data = response.json()
        if data:
            latitude = data[0]['lat']
            longitude = data[0]['lon']
            print(f"Latitude: {latitude}, Longitude: {longitude}")
        else:
            print("No data found for the specified location.")
    except requests.exceptions.JSONDecodeError:
        print("Error: The response is not in JSON format.")
        print("Response Content:", response.text)
else:
    print(f"Failed to fetch data. Status code: {response.status_code}")
    print("Response Content:", response.text)
