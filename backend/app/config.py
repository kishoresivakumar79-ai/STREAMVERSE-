import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "STREAMVERSE"
    APP_ENV: str = "development"
    SECRET_KEY: str = "streamverse_super_secret_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    DATABASE_URL: str = "postgresql://streamverse_user:streamverse_pass@localhost:5432/streamverse_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # TMDB API
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE_URL: str = "https://image.tmdb.org/t/p"

    DEFAULT_REGION: str = "IN"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

