from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.schemas import WatchlistAction
from app.services.tmdb_service import MOCK_MOVIES

router = APIRouter(prefix="/api/watchlist", tags=["Universal Watchlist"])

# In-memory store for active session
user_watchlists: Dict[str, List[int]] = {
    "demo-user": [1072790, 872954] # Leo & Vikram pre-added for demo
}

@router.get("")
async def get_watchlist(user_id: str = "demo-user") -> List[Dict[str, Any]]:
    """Fetch all movies saved in the user's universal watchlist."""
    movie_ids = user_watchlists.get(user_id, [])
    return [m for m in MOCK_MOVIES if m["id"] in movie_ids]

@router.post("/toggle")
async def toggle_watchlist(action: WatchlistAction) -> Dict[str, Any]:
    """Add or remove a movie from universal watchlist."""
    user_id = action.user_id or "demo-user"
    if user_id not in user_watchlists:
        user_watchlists[user_id] = []
        
    if action.movie_id in user_watchlists[user_id]:
        user_watchlists[user_id].remove(action.movie_id)
        return {"status": "removed", "movie_id": action.movie_id, "in_watchlist": False}
    else:
        user_watchlists[user_id].append(action.movie_id)
        return {"status": "added", "movie_id": action.movie_id, "in_watchlist": True}

