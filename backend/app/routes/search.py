from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.schemas import SearchFilter
from app.services.tmdb_service import MOCK_MOVIES

router = APIRouter(prefix="/api/search", tags=["Universal OTT Search"])

@router.post("")
async def universal_search(filter_req: SearchFilter) -> List[Dict[str, Any]]:
    """
    Search movies across all supported OTT platforms with smart multi-attribute filters.
    """
    results = MOCK_MOVIES
    query = filter_req.query.strip().lower() if filter_req.query else ""

    # Filter by text search
    if query:
        results = [
            m for m in results
            if query in m["title"].lower()
            or query in m.get("original_title", "").lower()
            or query in m.get("overview", "").lower()
            or any(query in actor.lower() for actor in m.get("cast", []))
            or query in m.get("director", "").lower()
        ]

    # Filter by language
    if filter_req.language and filter_req.language != "all":
        results = [m for m in results if m.get("original_language") == filter_req.language]

    # Filter by genre
    if filter_req.genre and filter_req.genre != "All":
        results = [m for m in results if filter_req.genre in m.get("genres", [])]

    # Filter by OTT Platform
    if filter_req.ott_platform and filter_req.ott_platform != "all":
        target_ott = filter_req.ott_platform.lower()
        filtered = []
        for m in results:
            providers = [p.get("provider_name", "").lower() for p in m.get("providers", [])]
            if any(target_ott in p for p in providers):
                filtered.append(m)
        results = filtered

    # Filter by minimum rating
    if filter_req.min_rating and filter_req.min_rating > 0:
        results = [m for m in results if float(m.get("vote_average", 0)) >= filter_req.min_rating]

    return results

