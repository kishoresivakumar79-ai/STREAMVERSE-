-- ========================================================
-- STREAMVERSE: Database Schema (PostgreSQL)
-- All-in-One OTT Discovery & Streaming Platform
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & AUTHENTICATION
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROFILES & PREFERENCES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    preferred_languages TEXT[] DEFAULT ARRAY['ta', 'en', 'hi'],
    preferred_genres TEXT[] DEFAULT ARRAY['Action', 'Thriller', 'Sci-Fi'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OTT PLATFORMS DIRECTORY
CREATE TABLE IF NOT EXISTS ott_platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    base_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. MOVIES & SERIES METADATA
CREATE TABLE IF NOT EXISTS movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INT UNIQUE,
    imdb_id VARCHAR(30),
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    overview TEXT,
    tagline VARCHAR(500),
    release_date DATE,
    release_year INT,
    runtime_minutes INT,
    original_language VARCHAR(10) DEFAULT 'ta',
    poster_path VARCHAR(500),
    backdrop_path VARCHAR(500),
    trailer_url VARCHAR(500),
    vote_average NUMERIC(3, 1) DEFAULT 0.0,
    vote_count INT DEFAULT 0,
    popularity NUMERIC(8, 2) DEFAULT 0.0,
    is_series BOOLEAN DEFAULT FALSE,
    content_type VARCHAR(20) DEFAULT 'movie', -- 'movie', 'series', 'licensed_stream'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. GENRES & MOVIE MAPPINGS
CREATE TABLE IF NOT EXISTS genres (
    id INT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- 6. OTT AVAILABILITY & WATCH PROVIDERS (Region: India)
CREATE TABLE IF NOT EXISTS movie_providers (
    id SERIAL PRIMARY KEY,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    platform_id INT REFERENCES ott_platforms(id) ON DELETE CASCADE,
    availability_type VARCHAR(50) NOT NULL, -- 'flatrate' (subscription), 'rent', 'buy', 'free'
    quality VARCHAR(20) DEFAULT '4K UHD',   -- 'HD', '4K UHD', 'Dolby Atmos'
    direct_watch_url TEXT NOT NULL,
    price_inr NUMERIC(6, 2) DEFAULT 0.00,
    region VARCHAR(10) DEFAULT 'IN',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_movie_platform_region UNIQUE (movie_id, platform_id, availability_type, region)
);

-- 7. USER WATCHLIST
CREATE TABLE IF NOT EXISTS watchlists (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_watchlist UNIQUE (user_id, movie_id)
);

-- 8. USER RATINGS & REVIEWS
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    rating NUMERIC(2, 1) CHECK (rating >= 0.5 AND rating <= 10.0),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_rating UNIQUE (user_id, movie_id)
);

-- 9. USER WATCH HISTORY
CREATE TABLE IF NOT EXISTS watch_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    watch_duration_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. LICENSED CONTENT & INTERNAL STREAMING (Part B - Own OTT)
CREATE TABLE IF NOT EXISTS licensed_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID UNIQUE REFERENCES movies(id) ON DELETE CASCADE,
    hls_manifest_url TEXT NOT NULL, -- e.g. /streams/sample_film/master.m3u8
    mp4_fallback_url TEXT,
    duration_seconds INT NOT NULL,
    license_holder VARCHAR(255) NOT NULL,
    is_drm_protected BOOLEAN DEFAULT FALSE,
    requires_subscription BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. INDEXES FOR HIGH-PERFORMANCE SEARCH & RECOMMENDATIONS
CREATE INDEX IF NOT EXISTS idx_movies_tmdb ON movies(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_movies_language ON movies(original_language);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(vote_average DESC);
CREATE INDEX IF NOT EXISTS idx_providers_movie ON movie_providers(movie_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON watch_history(user_id);

-- ========================================================
-- INITIAL SEED DATA FOR DEMO & TESTING
-- ========================================================

-- Insert major Indian OTT Platforms
INSERT INTO ott_platforms (name, code, logo_url, base_url, display_order)
VALUES 
    ('Netflix', 'netflix', 'https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg', 'https://www.netflix.com', 1),
    ('Amazon Prime Video', 'prime', 'https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png', 'https://www.primevideo.com', 2),
    ('JioHotstar', 'hotstar', 'https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg', 'https://www.hotstar.com', 3),
    ('Sony LIV', 'sonyliv', 'https://www.sonyliv.com/assets/liv-logo.png', 'https://www.sonyliv.com', 4),
    ('ZEE5', 'zee5', 'https://www.zee5.com/images/ZEE5_logo.svg', 'https://www.zee5.com', 5),
    ('YouTube Movies', 'youtube', 'https://www.youtube.com/s/desktop/e2285189/img/favicon_144x144.png', 'https://www.youtube.com', 6)
ON CONFLICT (code) DO NOTHING;

-- Insert Standard Genres
INSERT INTO genres (id, name)
VALUES 
    (28, 'Action'),
    (12, 'Adventure'),
    (16, 'Animation'),
    (35, 'Comedy'),
    (80, 'Crime'),
    (18, 'Drama'),
    (14, 'Fantasy'),
    (27, 'Horror'),
    (9648, 'Mystery'),
    (10749, 'Romance'),
    (878, 'Sci-Fi'),
    (53, 'Thriller')
ON CONFLICT (id) DO NOTHING;

