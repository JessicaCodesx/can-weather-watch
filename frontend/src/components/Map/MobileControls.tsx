import React from 'react';
import { Fab, Box } from '@mui/material';
import { MyLocation, Refresh } from '@mui/icons-material';

interface MobileControlsProps {
  onLocationClick: () => void;
  onRefresh: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onLocationClick, onRefresh }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000,
      }}
    >
      <Fab color="primary" size="small" onClick={onLocationClick}>
        <MyLocation />
      </Fab>
      <Fab color="secondary" size="small" onClick={onRefresh}>
        <Refresh />
      </Fab>
    </Box>
  );
};

export default MobileControls;