from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict
from app.services.weather_service import weather_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/alerts")
async def get_weather_alerts(
    lat: float = Query(..., description="Latitude", ge=-90, le=90),
    lon: float = Query(..., description="Longitude", ge=-180, le=180)
) -> List[Dict]:
    """Get current weather alerts for a location"""
    try:
        alerts = await weather_service.get_weather_alerts(lat, lon)
        return alerts
    except Exception as e:
        logger.error(f"Error in get_weather_alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather alerts")

@router.get("/current")
async def get_current_conditions(
    lat: float = Query(..., description="Latitude", ge=-90, le=90),
    lon: float = Query(..., description="Longitude", ge=-180, le=180)
) -> Dict:
    """Get current weather conditions for a location"""
    try:
        conditions = await weather_service.get_current_conditions(lat, lon)
        return conditions
    except Exception as e:
        logger.error(f"Error in get_current_conditions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch current conditions")

@router.get("/forecast")
async def get_forecast(
    lat: float = Query(..., description="Latitude", ge=-90, le=90),
    lon: float = Query(..., description="Longitude", ge=-180, le=180)
) -> Dict:
    """Get weather forecast for a location"""
    try:
        forecast = await weather_service.get_forecast(lat, lon)
        return forecast
    except Exception as e:
        logger.error(f"Error in get_forecast: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch forecast")

@router.get("/alerts/regions")
async def get_alerts_for_regions() -> List[Dict]:
    """Get weather alerts for major Canadian regions"""
    # Major Canadian cities coordinates
    major_cities = [
        {"name": "Toronto", "lat": 43.6532, "lon": -79.3832},
        {"name": "Vancouver", "lat": 49.2827, "lon": -123.1207},
        {"name": "Montreal", "lat": 45.5017, "lon": -73.5673},
        {"name": "Calgary", "lat": 51.0447, "lon": -114.0719},
        {"name": "Edmonton", "lat": 53.5461, "lon": -113.4938},
        {"name": "Ottawa", "lat": 45.4215, "lon": -75.6972},
        {"name": "Winnipeg", "lat": 49.8951, "lon": -97.1384},
        {"name": "Halifax", "lat": 44.6488, "lon": -63.5752},
        {"name": "Quebec City", "lat": 46.8139, "lon": -71.2080},
        {"name": "Saskatoon", "lat": 52.1579, "lon": -106.6702}
    ]
    
    all_alerts = []
    for city in major_cities:
        try:
            alerts = await weather_service.get_weather_alerts(city["lat"], city["lon"])
            for alert in alerts:
                alert["city"] = city["name"]
            all_alerts.extend(alerts)
        except Exception as e:
            logger.error(f"Error fetching alerts for {city['name']}: {e}")
    
    return all_alerts