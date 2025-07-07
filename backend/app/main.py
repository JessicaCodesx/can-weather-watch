from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import weather  # Add this import

app = FastAPI(
    title="CanWeatherWatch API",
    description="Canadian Weather Alert and Traffic Camera API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include weather routes
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])

@app.get("/")
async def root():
    return {"message": "CanWeatherWatch API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "ready", "services": "online"}

@app.get("/api/test")
async def test_endpoint():
    return {
        "test": "success", 
        "message": "Backend is working perfectly!",
        "features": ["weather alerts", "current conditions", "forecasts", "traffic cameras"]
    }