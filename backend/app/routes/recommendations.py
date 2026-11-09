from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.schemas import RecommendationRequest
from app.services.ai_recommender import ai_engine

router = APIRouter(prefix="/api/recommendations", tags=["AI Recommendation Engine"])

@router.get("/content-based/{movie_id}")
async def get_content_recommendations(movie_id: int, limit: int = 4) -> List[Dict[str, Any]]:
    """
    Returns movies with highest Cosine Similarity based on Cast, Director, Overview, and Genres.
    """
    return ai_engine.get_content_based_recommendations(movie_id, top_n=limit)

@router.post("/personalized")
async def get_personalized_recommendations(req: RecommendationRequest) -> List[Dict[str, Any]]:
    """
    Hybrid Taste Recommendation matching user's preferred genres & languages.
    """
    return ai_engine.get_personalized_recommendations(
        preferred_languages=req.preferred_languages,
        preferred_genres=req.preferred_genres,
        top_n=req.limit
    )

@router.get("/mood/{mood_tag}")
async def get_mood_recommendations(mood_tag: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    AI Mood Recommender: Matches user's emotional state to semantic movie metadata.
    Supported tags: 'high-octane', 'mind-bending', 'inspirational', 'sci-fi', 'tamil-mass'.
    """
    return ai_engine.get_mood_recommendations(mood_tag, top_n=limit)

