import React from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import { LoginOutlined, HealthAndSafety } from '@mui/icons-material';
import { useAuth } from '../contexts/HealthcareAuthContext';
import { AppConfig } from '../config';

const Login = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ py: 4 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minWidth: 400,
          }}
        >
          {/* Healthcare Logo */}
          <Box sx={{ mb: 3 }}>
            <HealthAndSafety 
              sx={{ 
                fontSize: 80, 
                color: 'primary.main',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }} 
            />
          </Box>

          {/* Title */}
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HealthCare Pro
          </Typography>

          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            Secure Healthcare Management System
          </Typography>

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginOutlined />}
            onClick={handleLogin}
            disabled={isLoading}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA8D2 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px 2px rgba(33, 203, 243, .4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Info */}
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ mt: 3, display: 'block' }}
          >
            Authentication Provider: {AppConfig.AUTH_BY}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;