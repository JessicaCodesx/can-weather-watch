from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import alerts, cameras, locations

app = FastAPI(
    title="CanWeatherWatch API",
    description="Canadian Weather Alert and Traffic Camera API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(cameras.router, prefix="/api/cameras", tags=["cameras"])
app.include_router(locations.router, prefix="/api/locations", tags=["locations"])

@app.get("/")
async def root():
    return {"message": "CanWeatherWatch API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}