from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.routes import movies, search, recommendations, watchlist, auth, admin

app = FastAPI(
    title=settings.APP_NAME,
    description="🎬 All-in-One OTT Streaming & Movie Discovery Platform API",
    version="2.0.0"
)

# Enable CORS for Next.js / Frontend clients
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(movies.router)
app.include_router(search.router)
app.include_router(recommendations.router)
app.include_router(watchlist.router)
app.include_router(auth.router)
app.include_router(admin.router)

# Optional Static Video Mount for HLS streaming (Part B - Own streaming)
os.makedirs("streaming/media", exist_ok=True)
app.mount("/stream-media", StaticFiles(directory="streaming/media"), name="media")

# Mount Assets (Posters and Screenshots)
assets_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "assets"))
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")


@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": "2.0.0",
        "region": settings.DEFAULT_REGION,
        "ai_engine": "operational (scikit-learn TF-IDF + Cosine Sim)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

