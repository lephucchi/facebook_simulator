from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.config import settings
from app.core.database import create_tables
from app.api import auth, posts, websocket, stories, messages
from app.services.init_data import init_sample_data, init_sample_stories

# Create FastAPI app
app = FastAPI(
    title="Facebook Simulator API",
    description="A Facebook-like social media platform API",
    version="1.0.0",
    debug=settings.debug
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:3000",
        settings.frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_folder, exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory=settings.upload_folder), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(stories.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(websocket.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    create_tables()
    # Initialize sample data
    await init_sample_data()
    # Initialize sample stories
    await init_sample_stories()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Facebook Simulator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/api/init-sample-data")
async def init_sample_data_endpoint():
    """Initialize sample data manually"""
    from app.services.init_data import init_sample_data
    await init_sample_data()
    return {"message": "Sample data initialized successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
