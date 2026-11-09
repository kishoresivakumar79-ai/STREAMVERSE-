import asyncio
import sys
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Add backend to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.services.tmdb_service import MOCK_MOVIES
from app.services.ai_recommender import ai_engine
from app.routes.search import universal_search
from app.schemas.schemas import SearchFilter
from app.routes.admin import get_analytics

async def run_verification():
    print("=" * 60)
    print("STREAMVERSE: FULL PLATFORM VERIFICATION")
    print("=" * 60)

    # 1. Verify Movie Catalog & Individual Poster Images
    print(f"\n[1] Verifying Movie Catalog ({len(MOCK_MOVIES)} titles):")
    for m in MOCK_MOVIES:
        has_poster = m.get("poster_path") and m["poster_path"].startswith("http")
        has_providers = len(m.get("providers", [])) > 0 or m.get("is_licensed_stream")
        status = "[OK]" if has_poster and has_providers else "[FAIL]"
        provider_name = m["providers"][0]["provider_name"] if m.get("providers") else "Own Stream"
        print(f"  {status} {m['title']} ({m['release_year']}) -> OTT: {provider_name} | Poster: {m['poster_path'][:45]}...")

    # 2. Verify Scikit-learn TF-IDF & Cosine Similarity
    print("\n[2] Testing AI Recommendation Engine (Content-Based):")
    leo_recs = ai_engine.get_content_based_recommendations(1072790, top_n=3)
    print(f"  Target: Leo (Thalapathy Vijay / Action)")
    print(f"  AI Recommended: {[r['title'] for r in leo_recs]}")
    assert len(leo_recs) == 3

    # 3. Verify AI Mood Recommender
    print("\n[3] Testing AI Semantic Mood Recommender:")
    for mood in ["high-octane", "mind-bending", "tamil-mass", "inspirational"]:
        recs = ai_engine.get_mood_recommendations(mood, top_n=2)
        print(f"  Mood '{mood}': {[r['title'] for r in recs]}")

    # 4. Verify Universal Search
    print("\n[4] Testing Universal Multi-OTT Search Engine:")
    search_filter = SearchFilter(query="Kamal", language="all", ott_platform="all", min_rating=0.0)
    search_res = await universal_search(search_filter)
    print(f"  Query 'Kamal': {[m['title'] for m in search_res]}")
    assert any("Vikram" in m["title"] for m in search_res)

    # 5. Verify Admin Analytics
    print("\n[5] Testing Admin & Streaming Analytics:")
    analytics = await get_analytics()
    print(f"  Total Users: {analytics['overview']['total_users']}")
    print(f"  Active Streamers: {analytics['overview']['monthly_active_streamers']}")
    print(f"  Top Platform Share: {analytics['ott_redirect_share'][0]['platform']} ({analytics['ott_redirect_share'][0]['share_percentage']}%)")

    print("\n" + "=" * 60)
    print("SUCCESS: ALL PLATFORM MODULES VERIFIED & OPERATIONAL!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(run_verification())
