from fastapi import APIRouter, HTTPException
import requests
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
import feedparser
import json

router = APIRouter()

# Define response model for consistent output
class NewsArticle(BaseModel):
    id: int
    title: str
    description: str
    source: str
    published: str
    url: str
    image: str = None

@router.get("/news", response_model=List[NewsArticle])
async def get_news(
    query: str = None,
    days: int = 30,
    sort_by: str = "publishedAt"
):
    # API keys
    NEWS_API_KEY = "e64a30cc69d544ddb007e9a0438a9de0"
    GNEWS_API_KEY = "60e896a5b35fc78171ec7b347de8bd4b"

    all_articles = []

    # Method 1: GNews API for Indian agriculture news
    try:
        gnews_queries = [
            "agriculture India",
            "farming Tamil Nadu",
            "PM Kisan scheme",
            "agricultural schemes India",
            "farmer welfare Tamil Nadu",
            "crop insurance India",
            "agricultural subsidies Tamil Nadu",
            "organic farming India",
            "agricultural technology India",
            "farmer protests India"
        ]

        for query in gnews_queries[:5]:  # Limit to avoid rate limits
            try:
                gnews_response = requests.get(
                    "https://gnews.io/api/v4/search",
                    params={
                        'q': query,
                        'lang': 'en',
                        'country': 'in',
                        'max': 5,
                        'apikey': GNEWS_API_KEY
                    },
                    timeout=10
                )
                gnews_response.raise_for_status()
                gnews_data = gnews_response.json()

                if gnews_data.get('articles'):
                    for article in gnews_data.get('articles', []):
                        article_url = article.get('url', '')
                        if not any(existing.get('url') == article_url for existing in all_articles):
                            all_articles.append({
                                'title': article.get('title', ''),
                                'description': article.get('description', ''),
                                'source': article.get('source', {}).get('name', 'GNews'),
                                'published': article.get('publishedAt', '').split('T')[0] if article.get('publishedAt') else datetime.now().strftime('%Y-%m-%d'),
                                'url': article_url,
                                'image': article.get('image', '')
                            })
            except Exception as e:
                print(f"Error with GNews query '{query}': {str(e)}")
                continue

    except Exception as e:
        print(f"Error with GNews API: {str(e)}")

    # Method 2: NewsAPI for agriculture news
    try:
        agriculture_queries = [
            "agriculture farming",
            "crop cultivation",
            "PM Kisan scheme",
            "agricultural technology",
            "farmer welfare",
            "organic farming",
            "precision agriculture",
            "agricultural subsidies",
            "crop prices market",
            "agricultural research"
        ]

        for query in agriculture_queries[:4]:  # Limit to avoid rate limits
            try:
                response = requests.get(
                    "https://newsapi.org/v2/everything",
                    params={
                        'q': query,
                        'from': (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d'),
                        'sortBy': sort_by,
                        'apiKey': NEWS_API_KEY,
                        'language': 'en',
                        'pageSize': 5
                    },
                    timeout=10
                )
                response.raise_for_status()
                data = response.json()

                if data['status'] == 'ok' and data.get('articles'):
                    for article in data.get('articles', []):
                        article_url = article.get('url', '')
                        if not any(existing.get('url') == article_url for existing in all_articles):
                            all_articles.append({
                                'title': article.get('title', ''),
                                'description': article.get('description', ''),
                                'source': article.get('source', {}).get('name', 'NewsAPI'),
                                'published': article.get('publishedAt', '').split('T')[0] if article.get('publishedAt') else datetime.now().strftime('%Y-%m-%d'),
                                'url': article_url,
                                'image': article.get('urlToImage', '')
                            })
            except Exception as e:
                print(f"Error with NewsAPI query '{query}': {str(e)}")
                continue

    except Exception as e:
        print(f"Error with NewsAPI: {str(e)}")

    # Method 3: RSS feeds for agriculture
    try:
        agriculture_rss_feeds = [
            "https://www.thehindubusinessline.com/economy/agri-business/?service=rss",
            "https://www.downtoearth.org.in/rss/agriculture",
            "https://www.krishijagran.com/rss.xml",
            "https://www.agriculture.gov.in/rss.xml",
            "https://www.financialexpress.com/feed/?s=agriculture",
            "https://www.livemint.com/rss/agriculture"
        ]

        for feed_url in agriculture_rss_feeds:
            try:
                feed = feedparser.parse(feed_url)
                for entry in feed.entries[:3]:
                    # Filter for agriculture-related content
                    title = entry.get('title', '').lower()
                    summary = entry.get('summary', '').lower()

                    agriculture_keywords = [
                        'agriculture', 'farming', 'crop', 'farmer', 'pm kisan',
                        'agricultural', 'cultivation', 'harvest', 'irrigation',
                        'fertilizer', 'pesticide', 'organic', 'precision'
                    ]

                    # Only include if content contains agriculture keywords
                    if any(keyword in title or keyword in summary for keyword in agriculture_keywords):
                        article_url = entry.get('link', '')
                        if not any(existing.get('url') == article_url for existing in all_articles):
                            all_articles.append({
                                'title': entry.get('title', ''),
                                'description': entry.get('summary', ''),
                                'source': feed.feed.get('title', 'Agriculture RSS'),
                                'published': datetime.now().strftime('%Y-%m-%d'),
                                'url': article_url,
                                'image': ''
                            })
            except Exception as e:
                print(f"Error with RSS feed '{feed_url}': {str(e)}")
                continue

    except Exception as e:
        print(f"Error with RSS feeds: {str(e)}")

    # Method 4: Government agriculture websites
    try:
        gov_news = fetch_government_agriculture_news()
        all_articles.extend(gov_news)
    except Exception as e:
        print(f"Error fetching government news: {str(e)}")

    # Transform to NewsArticle format with agriculture filtering
    articles = []
    agriculture_keywords = [
        'agriculture', 'farming', 'crop', 'farmer', 'pm kisan', 'agricultural',
        'cultivation', 'harvest', 'irrigation', 'fertilizer', 'pesticide',
        'organic', 'precision', 'soil', 'seed', 'yield', 'agricultural scheme'
    ]

    for index, article in enumerate(all_articles[:20]):  # Limit to 20 articles
        if article['title'] and article['description']:  # Only include articles with content
            # Check if article is agriculture-related
            title_lower = article['title'].lower()
            desc_lower = article['description'].lower()

            # Only include if content contains agriculture keywords
            if any(keyword in title_lower or keyword in desc_lower for keyword in agriculture_keywords):
                articles.append(
                    NewsArticle(
                        id=index + 1,
                        title=article['title'],
                        description=article['description'],
                        source=article['source'],
                        published=article['published'],
                        url=article['url'],
                        image=article.get('image', '')
                    )
                )

    return articles

def fetch_government_agriculture_news():
    """Fetch news from government agriculture websites"""
    gov_news = []
    current_date = datetime.now()

    try:
        # Agriculture-specific government sources
        agriculture_gov_sources = [
            {
                'name': 'PM Kisan Scheme',
                'url': 'https://pmkisan.gov.in',
                'title': 'PM Kisan Scheme - Direct Income Support',
                'description': 'Latest updates on PM Kisan scheme providing direct income support to farmers.',
                'source': 'Ministry of Agriculture'
            },
            {
                'name': 'Agricultural Schemes',
                'url': 'https://agriculture.gov.in',
                'title': 'Agricultural Schemes and Subsidies',
                'description': 'Latest agricultural schemes, subsidies, and farmer welfare programs.',
                'source': 'Ministry of Agriculture'
            },
            {
                'name': 'Crop Insurance',
                'url': 'https://pmfby.gov.in',
                'title': 'PM Fasal Bima Yojana - Crop Insurance',
                'description': 'Updates on crop insurance scheme and agricultural risk management.',
                'source': 'Ministry of Agriculture'
            },
            {
                'name': 'Agricultural Research',
                'url': 'https://icar.gov.in',
                'title': 'Agricultural Research and Technology',
                'description': 'Latest agricultural research, technology, and innovation updates.',
                'source': 'Indian Council of Agricultural Research'
            },
            {
                'name': 'Soil Health',
                'url': 'https://soilhealth.dac.gov.in',
                'title': 'Soil Health Card Scheme',
                'description': 'Updates on soil health assessment and agricultural soil management.',
                'source': 'Ministry of Agriculture'
            }
        ]

        for source in agriculture_gov_sources:
            gov_news.append({
                'title': source['title'],
                'description': source['description'],
                'source': source['source'],
                'published': current_date.strftime('%Y-%m-%d'),
                'url': source['url'],
                'image': ''
            })

    except Exception as e:
        print(f"Error fetching government news: {str(e)}")

    return gov_news

@router.get("/news/{news_id}", response_model=NewsArticle)
async def get_news_detail(news_id: int):
    """Get detailed information about a specific news article"""
    try:
        # Your NewsAPI key
        API_KEY = "e64a30cc69d544ddb007e9a0438a9de0"
        GNEWS_API_KEY = "60e896a5b35fc78171ec7b347de8bd4b"

        # Try GNews first for agriculture news
        try:
            gnews_response = requests.get(
                "https://gnews.io/api/v4/search",
                params={
                    'q': 'agriculture OR farming OR crops OR "PM Kisan" OR "agricultural schemes" OR "farmer welfare" OR "crop prices" OR "agricultural technology"',
                    'lang': 'en',
                    'country': 'in',
                    'max': 20,
                    'apikey': GNEWS_API_KEY
                },
                timeout=10
            )
            gnews_response.raise_for_status()
            gnews_data = gnews_response.json()

            if gnews_data.get('articles'):
                articles = gnews_data.get('articles', [])
                if 0 <= news_id - 1 < len(articles):
                    article = articles[news_id - 1]
                    return NewsArticle(
                        id=news_id,
                        title=article.get('title', 'No title available'),
                        description=article.get('description', 'No description available'),
                        source=article.get('source', {}).get('name', 'GNews'),
                        published=article.get('publishedAt', '').split('T')[0] if article.get('publishedAt') else datetime.now().strftime('%Y-%m-%d'),
                        url=article.get('url', ''),
                        image=article.get('image', '')
                    )
        except Exception as e:
            print(f"Error with GNews detail: {str(e)}")

        # Fallback to NewsAPI
        try:
            response = requests.get(
                "https://newsapi.org/v2/everything",
                params={
                    'q': "agriculture OR farming OR crops OR PM Kisan OR agricultural schemes",
                    'from': (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
                    'sortBy': 'publishedAt',
                    'apiKey': API_KEY,
                    'language': 'en',
                    'pageSize': 20
                },
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            if data['status'] == 'ok' and data.get('articles'):
                articles = data.get('articles', [])
                if 0 <= news_id - 1 < len(articles):
                    article = articles[news_id - 1]
                    return NewsArticle(
                        id=news_id,
                        title=article.get('title', 'No title available'),
                        description=article.get('description', 'No description available'),
                        source=article.get('source', {}).get('name', 'NewsAPI'),
                        published=article.get('publishedAt', '').split('T')[0] if article.get('publishedAt') else datetime.now().strftime('%Y-%m-%d'),
                        url=article.get('url', ''),
                        image=article.get('urlToImage', '')
                    )
        except Exception as e:
            print(f"Error with NewsAPI detail: {str(e)}")

        raise HTTPException(
            status_code=404,
            detail=f"News article with ID {news_id} not found"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch news detail: {str(e)}"
        )
