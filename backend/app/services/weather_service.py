import asyncio
from typing import List, Dict, Optional
from env_canada import ECWeather
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    """Service for fetching weather data from Environment Canada"""
    
    def __init__(self):
        self.cache = {}  # Simple in-memory cache for development
        
    async def get_weather_alerts(self, lat: float, lon: float) -> List[Dict]:
        """Fetch current weather alerts for given coordinates"""
        try:
            # Create ECWeather instance for the location
            ec_weather = ECWeather(coordinates=(lat, lon))
            
            # Update to get latest data
            await ec_weather.update()
            
            # Get alerts
            alerts = ec_weather.alerts or []
            
            # Format alerts for our API
            formatted_alerts = []
            for alert in alerts:
                formatted_alert = {
                    "id": alert.get("id", ""),
                    "title": alert.get("title", ""),
                    "description": alert.get("description", ""),
                    "severity": alert.get("priority", "unknown"),
                    "alert_type": alert.get("type", ""),
                    "effective_time": alert.get("date", ""),
                    "expires_time": alert.get("expires", ""),
                    "areas": alert.get("areas", []),
                    "coordinates": [lat, lon]
                }
                formatted_alerts.append(formatted_alert)
            
            logger.info(f"Found {len(formatted_alerts)} alerts for {lat}, {lon}")
            return formatted_alerts
            
        except Exception as e:
            logger.error(f"Error fetching weather alerts: {e}")
            return []
    
    async def get_current_conditions(self, lat: float, lon: float) -> Dict:
        """Fetch current weather conditions"""
        try:
            ec_weather = ECWeather(coordinates=(lat, lon))
            await ec_weather.update()
            
            conditions = ec_weather.conditions or {}
            
            return {
                "temperature": conditions.get("temperature", {}).get("value"),
                "condition": conditions.get("condition"),
                "humidity": conditions.get("humidity", {}).get("value"),
                "wind_speed": conditions.get("wind_speed", {}).get("value"),
                "wind_direction": conditions.get("wind_bearing", {}).get("value"),
                "pressure": conditions.get("pressure", {}).get("value"),
                "visibility": conditions.get("visibility", {}).get("value"),
                "observation_time": conditions.get("datetime"),
                "station": conditions.get("station"),
                "coordinates": [lat, lon]
            }
            
        except Exception as e:
            logger.error(f"Error fetching current conditions: {e}")
            return {}

    async def get_forecast(self, lat: float, lon: float) -> Dict:
        """Fetch weather forecast"""
        try:
            ec_weather = ECWeather(coordinates=(lat, lon))
            await ec_weather.update()
            
            daily_forecasts = ec_weather.daily_forecasts or []
            hourly_forecasts = ec_weather.hourly_forecasts or []
            
            return {
                "daily": daily_forecasts[:7],  # 7-day forecast
                "hourly": hourly_forecasts[:24],  # 24-hour forecast
                "coordinates": [lat, lon]
            }
            
        except Exception as e:
            logger.error(f"Error fetching forecast: {e}")
            return {"daily": [], "hourly": []}

# Create global instance
weather_service = WeatherService()