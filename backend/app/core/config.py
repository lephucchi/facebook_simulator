from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./facebook_simulator.db"
    
    # JWT
    jwt_secret_key: str = "your-super-secret-jwt-key-change-this-in-production-2024"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    
    # Server
    port: int = 8000
    host: str = "127.0.0.1"
    debug: bool = True
    
    # CORS
    frontend_url: str = "http://localhost:5173"
    
    # WebSocket
    websocket_url: str = "ws://localhost:8000/ws"
    
    # Upload
    max_file_size: int = 10485760  # 10MB
    upload_folder: str = "uploads/"
    
    class Config:
        env_file = ".env"

settings = Settings()
