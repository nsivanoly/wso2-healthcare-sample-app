import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocalHospital, Favorite } from '@mui/icons-material';

const Logo = ({ variant = 'full', size = 'medium' }) => {
  const sizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 48, text: 'h4' }
  };

  // Fallback to medium if size is invalid
  const currentSize = sizes[size] || sizes.medium;

  if (variant === 'icon') {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <LocalHospital 
          sx={{ 
            fontSize: currentSize.icon,
            color: 'primary.main',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }} 
        />
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box position="relative">
        <LocalHospital 
          sx={{ 
            fontSize: currentSize.icon,
            color: 'primary.main',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }} 
        />
        <Favorite 
          sx={{ 
            fontSize: currentSize.icon * 0.4,
            color: 'secondary.main',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }} 
        />
      </Box>
      <Box>
        <Typography 
          variant={currentSize.text} 
          component="div" 
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #2E7D32, #1976D2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          HealthCare
        </Typography>
        <Typography 
          variant="caption" 
          component="div" 
          color="text.secondary"
          sx={{ lineHeight: 1, mt: -0.5 }}
        >
          Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;