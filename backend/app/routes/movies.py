from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.services.tmdb_service import tmdb_service, MOCK_MOVIES

router = APIRouter(prefix="/api/movies", tags=["Movies & OTT Discovery"])

@router.get("/trending")
async def get_trending_movies(window: str = Query("week", pattern="^(day|week)$")) -> List[Dict[str, Any]]:
    """Fetch global & Indian trending movies with OTT provider data."""
    return await tmdb_service.get_trending(window)

@router.get("/tamil")
async def get_tamil_movies() -> List[Dict[str, Any]]:
    """Curated collection of top Tamil blockbusters."""
    return [m for m in MOCK_MOVIES if m.get("original_language") == "ta"]

@router.get("/licensed")
async def get_licensed_streams() -> List[Dict[str, Any]]:
    """STREAMVERSE direct streaming catalogue (Part B - Independent & Licensed Content)."""
    return [m for m in MOCK_MOVIES if m.get("is_licensed_stream") is True]

@router.get("/{movie_id}")
async def get_movie_details(movie_id: int) -> Dict[str, Any]:
    """Retrieve deep metadata and authorized Indian OTT providers for a given movie."""
    movie = await tmdb_service.get_movie_details(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie
