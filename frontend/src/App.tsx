import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Cloud } from '@mui/icons-material';
import MapContainer from './components/Map/MapContainer';
import WeatherPanel from './components/Weather/WeatherPanel';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Cloud sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CanWeatherWatch
            </Typography>
            <Typography variant="body2">
              Real-time Weather Alerts Across Canada
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Map */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <MapContainer />
            
            {/* Weather Panel Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: { xs: '90%', sm: '400px' },
                zIndex: 1000,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <WeatherPanel />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;