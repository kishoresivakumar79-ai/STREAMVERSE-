from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from app.services.tmdb_service import MOCK_MOVIES

router = APIRouter(prefix="/api/admin", tags=["Admin & Platform Analytics"])

class AdminMovieCreate(BaseModel):
    title: str
    original_title: str
    overview: str
    original_language: str = "ta"
    genres: List[str] = ["Action"]
    director: str = ""
    cast: List[str] = []
    release_year: int = 2026
    vote_average: float = 8.0
    stream_url: str = ""
    poster_path: str = ""
    backdrop_path: str = ""
    is_licensed_stream: bool = True
    providers: List[Dict[str, Any]] = []

@router.get("/analytics")
async def get_analytics() -> Dict[str, Any]:
    """Retrieve platform operational metrics, traffic distribution, and revenue."""
    total_titles = len(MOCK_MOVIES)
    licensed_count = sum(1 for m in MOCK_MOVIES if m.get("is_licensed_stream"))
    aggregated_count = total_titles - licensed_count

    return {
        "overview": {
            "total_users": 28450,
            "monthly_active_streamers": 19200,
            "total_watch_hours": 158400,
            "estimated_affiliate_revenue_inr": 184500,
            "total_titles_cataloged": total_titles,
            "licensed_originals": licensed_count,
            "external_aggregated": aggregated_count
        },
        "ott_redirect_share": [
            {"platform": "Netflix India", "share_percentage": 39, "color": "#E50914"},
            {"platform": "JioHotstar", "share_percentage": 28, "color": "#001E80"},
            {"platform": "Amazon Prime Video", "share_percentage": 19, "color": "#00A8E1"},
            {"platform": "STREAMVERSE Own Streams", "share_percentage": 10, "color": "#10B981"},
            {"platform": "ZEE5 & Sony LIV", "share_percentage": 4, "color": "#F59E0B"}
        ],
        "top_searched_titles": [
            {"query": "Leo", "searches": 14200, "dominant_ott": "Netflix"},
            {"query": "Vikram", "searches": 11800, "dominant_ott": "JioHotstar"},
            {"query": "Maharaja", "searches": 9400, "dominant_ott": "Netflix"},
            {"query": "Jailer", "searches": 8700, "dominant_ott": "Amazon Prime Video"},
            {"query": "The Last Horizon", "searches": 5300, "dominant_ott": "STREAMVERSE"}
        ],
        "streaming_server_health": {
            "cdn_egress_gb": 4820,
            "hls_cache_hit_ratio": "96.4%",
            "average_bitrate": "4.8 Mbps",
            "active_hls_connections": 142
        }
    }

@router.post("/movies")
async def admin_create_movie(movie_data: AdminMovieCreate) -> Dict[str, Any]:
    """Admin endpoint to publish a new licensed movie or OTT aggregation link."""
    new_id = max(m["id"] for m in MOCK_MOVIES) + 1 if MOCK_MOVIES else 1000001
    
    movie_dict = movie_data.model_dump()
    movie_dict["id"] = new_id
    movie_dict["vote_count"] = 1
    movie_dict["popularity"] = 85.0
    
    # Prepend to the top of catalog
    MOCK_MOVIES.insert(0, movie_dict)
    return {"status": "success", "message": "Movie published successfully", "movie": movie_dict}

@router.delete("/movies/{movie_id}")
async def admin_delete_movie(movie_id: int) -> Dict[str, Any]:
    """Delete a movie entry from STREAMVERSE catalog."""
    target_idx = None
    for idx, m in enumerate(MOCK_MOVIES):
        if m["id"] == movie_id:
            target_idx = idx
            break
            
    if target_idx is None:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    removed = MOCK_MOVIES.pop(target_idx)
    return {"status": "success", "message": f"Movie '{removed['title']}' deleted successfully"}

