import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    watch_history = relationship("WatchHistory", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    display_name = Column(String(100))
    avatar_url = Column(String(500))
    preferred_languages = Column(String(255), default="ta,en,hi")
    preferred_genres = Column(String(255), default="Action,Thriller,Sci-Fi")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class OTTPlatform(Base):
    __tablename__ = "ott_platforms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    logo_url = Column(String(500))
    base_url = Column(String(255))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    providers = relationship("MovieProvider", back_populates="platform")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tmdb_id = Column(Integer, unique=True, index=True)
    imdb_id = Column(String(30))
    title = Column(String(255), nullable=False, index=True)
    original_title = Column(String(255))
    overview = Column(Text)
    tagline = Column(String(500))
    release_date = Column(String(20))
    release_year = Column(Integer)
    runtime_minutes = Column(Integer)
    original_language = Column(String(10), default="ta", index=True)
    poster_path = Column(String(500))
    backdrop_path = Column(String(500))
    trailer_url = Column(String(500))
    vote_average = Column(Float, default=0.0)
    vote_count = Column(Integer, default=0)
    popularity = Column(Float, default=0.0)
    is_series = Column(Boolean, default=False)
    content_type = Column(String(20), default="movie")
    is_licensed_stream = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    providers = relationship("MovieProvider", back_populates="movie", cascade="all, delete-orphan")
    watchlists = relationship("Watchlist", back_populates="movie", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="movie", cascade="all, delete-orphan")
    licensed_stream = relationship("LicensedStream", back_populates="movie", uselist=False, cascade="all, delete-orphan")

class MovieProvider(Base):
    __tablename__ = "movie_providers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    movie_id = Column(String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    platform_id = Column(Integer, ForeignKey("ott_platforms.id", ondelete="CASCADE"), nullable=False)
    availability_type = Column(String(50), default="flatrate") # flatrate, rent, buy, free
    quality = Column(String(20), default="4K UHD")
    direct_watch_url = Column(Text, nullable=False)
    price_inr = Column(Numeric(6, 2), default=0.00)
    region = Column(String(10), default="IN")

    movie = relationship("Movie", back_populates="providers")
    platform = relationship("OTTPlatform", back_populates="providers")

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlists")
    movie = relationship("Movie", back_populates="watchlists")

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Float, nullable=False)
    review = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ratings")
    movie = relationship("Movie", back_populates="ratings")

class WatchHistory(Base):
    __tablename__ = "watch_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    movie_id = Column(String(36), ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    watch_duration_seconds = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    last_watched_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watch_history")

class LicensedStream(Base):
    __tablename__ = "licensed_streams"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    movie_id = Column(String(36), ForeignKey("movies.id", ondelete="CASCADE"), unique=True, nullable=False)
    hls_manifest_url = Column(Text, nullable=False)
    mp4_fallback_url = Column(Text)
    duration_seconds = Column(Integer, nullable=False)
    license_holder = Column(String(255), nullable=False)
    is_drm_protected = Column(Boolean, default=False)
    requires_subscription = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    movie = relationship("Movie", back_populates="licensed_stream")

