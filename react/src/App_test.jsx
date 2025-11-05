import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';

import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';

// Simple test component
const TestPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Typography variant="h2" gutterBottom>
        Healthcare App is Running! 🏥
      </Typography>
      <Typography variant="h6">
        React + Material-UI + Vite is working correctly
      </Typography>
    </Box>
  );
};

// Simple app content without authentication
const SimpleAppContent = () => {
  const { theme } = useThemeMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="*" element={<TestPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

function SimpleApp() {
  return (
    <ThemeModeProvider>
      <SimpleAppContent />
    </ThemeModeProvider>
  );
}

export default SimpleApp;