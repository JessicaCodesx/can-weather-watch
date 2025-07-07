import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton, Collapse } from '@mui/material';
import { Warning, Thermostat, Air, ExpandMore, ExpandLess } from '@mui/icons-material';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: string;
  alert_type: string;
  city?: string;
}

interface WeatherPanelProps {
  className?: string;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRegionalAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/weather/alerts/regions');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching regional alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionalAlerts();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRegionalAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': case 'severe': return 'error';
      case 'medium': case 'moderate': return 'warning';
      case 'low': case 'minor': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card className={className} style={{ margin: '10px', maxHeight: '400px', overflow: 'auto' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            <Warning color="warning" style={{ marginRight: '8px' }} />
            Weather Alerts
          </Typography>
          <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Collapse in={isExpanded}>
          {isLoading ? (
            <Typography variant="body2" color="textSecondary">
              Loading alerts...
            </Typography>
          ) : alerts.length > 0 ? (
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {alerts.length} active alert{alerts.length > 1 ? 's' : ''} across Canada
              </Typography>
              {alerts.map((alert, index) => (
                <Card key={index} variant="outlined" style={{ margin: '8px 0', padding: '8px' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="subtitle2" color="primary">
                        {alert.title}
                      </Typography>
                      {alert.city && (
                        <Typography variant="caption" color="textSecondary">
                          {alert.city}
                        </Typography>
                      )}
                      <Typography variant="body2" style={{ marginTop: '4px' }}>
                        {alert.description?.substring(0, 120)}
                        {alert.description?.length > 120 ? '...' : ''}
                      </Typography>
                    </Box>
                    <Chip 
                      label={alert.severity} 
                      size="small" 
                      color={getSeverityColor(alert.severity) as any}
                      variant="outlined"
                    />
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" py={2}>
              <Typography variant="body2" color="textSecondary">
                No active weather alerts across major Canadian cities
              </Typography>
              <Chip label="All Clear" color="success" size="small" style={{ marginTop: '8px' }} />
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default WeatherPanel;