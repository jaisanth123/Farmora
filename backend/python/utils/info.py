from fastapi import APIRouter, HTTPException
import requests
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

# Define response model for consistent output
class NewsArticle(BaseModel):
    id: int
    title: str
    description: str
    source: str
    published: str
    url: str

@router.get("/news", response_model=List[NewsArticle])
async def get_news(
    query: str = "farmers AND schemes AND agriculture",
    days: int = 25,
    sort_by: str = "popularity"
):
    # Your NewsAPI key
    API_KEY = "e64a30cc69d544ddb007e9a0438a9de0"
    
    # Base URL for NewsAPI 'everything' endpoint   
    BASE_URL = "https://newsapi.org/v2/everything"
    
    # Define parameters
    params = {
        'q': query,
        'from': (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d'),
        'sortBy': sort_by,
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
            # Transform the data to match your expected format
            articles = []
            for index, article in enumerate(data.get('articles', [])):
                articles.append(
                    NewsArticle(
                        id=index + 1,
                        title=article.get('title', 'No title available'),
                        description=article.get('description', 'No description available'),
                        source=article.get('source', {}).get('name', 'Unknown source'),
                        published=article.get('publishedAt', '').split('T')[0] if article.get('publishedAt') else datetime.now().strftime('%Y-%m-%d'),
                        url=article.get('url', '')
                    )
                )
            return articles
        else:
            raise HTTPException(
                status_code=400,
                detail=f"API Error: {data.get('message', 'Unknown error occurred')}"
            )
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch news: {str(e)}"
        )