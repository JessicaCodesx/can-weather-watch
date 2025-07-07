import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the default icon issue
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface WeatherData {
  temperature?: number;
  condition?: string;
  alerts: any[];
}

interface MapClickHandler {
  lat: number;
  lng: number;
  weatherData: WeatherData | null;
}

const MapContainer: React.FC = () => {
  const [clickedLocation, setClickedLocation] = useState<MapClickHandler | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Canada center coordinates and zoom
  const canadaCenter: [number, number] = [56.1304, -106.3468];
  const defaultZoom = 4;

  const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData> => {
    try {
      // Fetch current conditions and alerts
      const [conditionsResponse, alertsResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/weather/current?lat=${lat}&lon=${lng}`),
        fetch(`http://localhost:8000/api/weather/alerts?lat=${lat}&lon=${lng}`)
      ]);

      const conditions = await conditionsResponse.json();
      const alerts = await alertsResponse.json();

      return {
        temperature: conditions.temperature,
        condition: conditions.condition,
        alerts: alerts || []
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return { alerts: [] };
    }
  };

  // Component to handle map clicks
  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setIsLoading(true);
        
        try {
          const weatherData = await fetchWeatherData(lat, lng);
          setClickedLocation({ lat, lng, weatherData });
        } catch (error) {
          console.error('Error handling map click:', error);
        } finally {
          setIsLoading(false);
        }
      },
    });
    return null;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <LeafletMapContainer
        center={canadaCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Base map tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map click handler */}
        <MapClickHandler />
        
        {/* Show marker and popup for clicked location */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]}>
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3>Weather Information</h3>
                <p><strong>Location:</strong> {clickedLocation.lat.toFixed(4)}, {clickedLocation.lng.toFixed(4)}</p>
                
                {isLoading ? (
                  <p>Loading weather data...</p>
                ) : (
                  <>
                    {clickedLocation.weatherData?.temperature && (
                      <p><strong>Temperature:</strong> {clickedLocation.weatherData.temperature}°C</p>
                    )}
                    {clickedLocation.weatherData?.condition && (
                      <p><strong>Condition:</strong> {clickedLocation.weatherData.condition}</p>
                    )}
                    
                    {clickedLocation.weatherData?.alerts && clickedLocation.weatherData.alerts.length > 0 ? (
                      <div>
                        <h4>Active Alerts:</h4>
                        {clickedLocation.weatherData.alerts.map((alert, index) => (
                          <div key={index} style={{ background: '#ffeb3b', padding: '5px', margin: '2px', borderRadius: '3px' }}>
                            <strong>{alert.title}</strong>
                            <p style={{ fontSize: '12px', margin: '2px 0' }}>{alert.description?.substring(0, 100)}...</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'green' }}>No active weather alerts</p>
                    )}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainer;