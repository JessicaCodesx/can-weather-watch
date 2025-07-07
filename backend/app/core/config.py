from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379"
    SECRET_KEY: str
    DEBUG: bool = False
    FRONTEND_URL: str = "http://localhost:3000"
    
    # API Keys
    ECCC_API_KEY: Optional[str] = None
    OPENWEATHER_API_KEY: Optional[str] = None
    MAPBOX_ACCESS_TOKEN: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()