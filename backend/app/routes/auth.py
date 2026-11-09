from fastapi import APIRouter, HTTPException
from app.schemas.schemas import UserRegister, UserLogin, Token

router = APIRouter(prefix="/api/auth", tags=["Authentication & Profiles"])

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    """User account creation with taste preference initialization."""
    return {
        "access_token": "mock_jwt_token_streamverse_" + user.username,
        "token_type": "bearer",
        "user_id": "usr_9921",
        "username": user.username
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """User login endpoint returning JWT bearer token."""
    if not credentials.email or not credentials.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {
        "access_token": "mock_jwt_token_streamverse_session",
        "token_type": "bearer",
        "user_id": "usr_demo",
        "username": credentials.email.split("@")[0]
    }

