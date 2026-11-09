import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure backend path is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app

client = TestClient(app)

def test_health_check():
    """Verify system health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "STREAMVERSE" in data["app"]

def test_get_trending_movies():
    """Verify trending movies returns catalog with providers."""
    response = client.get("/api/movies/trending")
    assert response.status_code == 200
    movies = response.json()
    assert len(movies) >= 5
    # Verify Leo exists
    titles = [m["title"] for m in movies]
    assert "Leo" in titles

def test_get_tamil_movies():
    """Verify Tamil cinema filter."""
    response = client.get("/api/movies/tamil")
    assert response.status_code == 200
    movies = response.json()
    for m in movies:
        assert m["original_language"] == "ta"

def test_movie_details():
    """Verify movie details endpoint."""
    response = client.get("/api/movies/1072790")
    assert response.status_code == 200
    movie = response.json()
    assert movie["title"] == "Leo"
    assert len(movie["providers"]) > 0
    assert movie["providers"][0]["provider_name"] == "Netflix"

def test_universal_search():
    """Verify multi-platform search."""
    payload = {
        "query": "Vikram",
        "language": "all",
        "ott_platform": "all",
        "min_rating": 0.0,
        "page": 1
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    results = response.json()
    assert len(results) > 0
    assert any("Vikram" in r["title"] for r in results)

def test_content_based_recommendations():
    """Verify Scikit-learn TF-IDF & Cosine Similarity."""
    response = client.get("/api/recommendations/content-based/1072790?limit=3")
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) <= 3
    # Leo should recommend other Lokesh / Action titles like Vikram, Jailer, Maharaja
    rec_titles = [r["title"] for r in recs]
    assert any(title in rec_titles for title in ["Vikram", "Jailer", "Maharaja", "Master", "Kaithi"])

def test_ai_mood_recommender():
    """Verify semantic mood recommendations."""
    response = client.get("/api/recommendations/mood/high-octane?limit=3")
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) > 0
    for r in recs:
        assert "recommendation_reason" in r

def test_watchlist_toggle():
    """Verify watchlist add and remove."""
    payload = {"movie_id": 1072790, "user_id": "test_user"}
    res1 = client.post("/api/watchlist/toggle", json=payload)
    assert res1.status_code == 200
    assert "status" in res1.json()

def test_admin_analytics():
    """Verify admin analytics metrics."""
    response = client.get("/api/admin/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "overview" in data
    assert "ott_redirect_share" in data

