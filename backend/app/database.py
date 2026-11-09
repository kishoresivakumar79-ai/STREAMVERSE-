import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

DATABASE_URL = settings.DATABASE_URL

# Fallback to SQLite if PostgreSQL is not available in local test mode
if not DATABASE_URL or "postgresql" not in DATABASE_URL:
    DATABASE_URL = "sqlite:///./streamverse.db"

# Create SQLAlchemy Engine
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception:
    # Safe fallback
    engine = create_engine("sqlite:///./streamverse_fallback.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

