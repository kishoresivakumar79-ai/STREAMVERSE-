from typing import List, Optional
from pydantic import BaseModel, Field

class WatchProvider(BaseModel):
    provider_id: int
    provider_name: str
    logo_path: Optional[str] = None
    watch_url: Optional[str] = None
    type: str = "flatrate"  # flatrate (subscription), rent, buy, free
    quality: Optional[str] = "4K UHD"

class MovieBase(BaseModel):
    id: int
    title: str
    original_title: Optional[str] = None
    overview: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    release_date: Optional[str] = None
    release_year: Optional[int] = None
    original_language: str = "ta"
    genres: List[str] = []
    vote_average: float = 0.0
    vote_count: int = 0
    popularity: float = 0.0
    is_licensed_stream: bool = False

class MovieDetail(MovieBase):
    runtime_minutes: Optional[int] = None
    director: Optional[str] = None
    cast: List[str] = []
    trailer_url: Optional[str] = None
    providers: List[WatchProvider] = []
    stream_url: Optional[str] = None  # internal HLS / video stream if licensed

class SearchFilter(BaseModel):
    query: Optional[str] = ""
    language: Optional[str] = None  # 'ta', 'en', 'hi', 'all'
    genre: Optional[str] = None
    ott_platform: Optional[str] = None  # 'netflix', 'prime', 'hotstar', etc.
    min_rating: Optional[float] = 0.0
    page: int = 1

class RecommendationRequest(BaseModel):
    movie_id: Optional[int] = None
    preferred_languages: List[str] = ["ta", "en", "hi"]
    preferred_genres: List[str] = ["Action", "Thriller"]
    limit: int = 8

class WatchlistAction(BaseModel):
    movie_id: int
    user_id: Optional[str] = "demo-user"

class UserRegister(BaseModel):
    email: str
    username: str
    password: str
    preferred_languages: List[str] = ["ta", "en"]
    preferred_genres: List[str] = ["Action", "Thriller"]

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str

