import requests
from datetime import datetime, timedelta

# Your NewsAPI key (seems to work now!)
API_KEY = "e64a30cc69d544ddb007e9a0438a9de0"

# Base URL for NewsAPI 'everything' endpoint
BASE_URL = "https://newsapi.org/v2/everything"

# Define parameters
params = {
    'q': 'farmers AND schemes AND agriculture',  # Your main interest
    'from': (datetime.now() - timedelta(days=25)).strftime('%Y-%m-%d'),  # Last 30 days
    'sortBy': 'popularity',
    'apiKey': API_KEY
}



try:
    # Make the GET request
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()  # Check for HTTP errors

    # Parse the JSON response
    data = response.json()

    # Check if the request was successful
    if data['status'] == 'ok':
        articles = data['articles']
        if articles:
            print(f"Found {len(articles)} articles:\n")
            for i, article in enumerate(articles, 1):
                title = article.get('title', 'No title available')
                description = article.get('description', 'No description available')
                url = article.get('url', 'No URL available')
                published_at = article.get('publishedAt', 'No date available')
                print(f"{i}. Title: {title}")
                print(f"   Description: {description}")
                print(f"   URL: {url}")
                print(f"   Published: {published_at}")
                print("-" * 50)
        else:
            print("No articles found. Try a broader query or check API coverage.")
    else:
        print(f"API Error: {data.get('message', 'Unknown error occurred')}")

except requests.exceptions.RequestException as e:
    print(f"Failed to fetch news: {e}")
    print(f"Response text: {response.text}")  # Debug output
