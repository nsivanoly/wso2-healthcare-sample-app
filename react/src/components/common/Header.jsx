import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  NotificationsOutlined,
  AccountCircle,
  Settings,
  Help,
  Brightness4,
  Brightness7,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/HealthcareAuthContext';
import { AppConfig } from '../../config';

const Header = ({ onDrawerToggle, sidebarCollapsed = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const { darkMode, toggleDarkMode } = useThemeMode();
  const { isAuthenticated, user, login, logout, isLoading, authEnabled } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleLogin = () => {
    login();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.includes('/patients')) return 'Patients';
    if (path.includes('/doctors')) return 'Doctors';
    if (path.includes('/appointments')) return 'Appointments';
    if (path.includes('/prescriptions')) return 'Prescriptions';
    return 'Healthcare Management';
  };

  // Get current user from auth context
  const currentUser = user || {
    name: 'Guest User',
    role: 'Visitor',
    department: 'Public',
    email: 'guest@healthcare.com',
    avatar: null
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center" flexGrow={1}>
          {/* Dynamic Hamburger Menu Button */}
          <Tooltip title={
            isMobile 
              ? "Toggle sidebar menu" 
              : sidebarCollapsed 
                ? "Expand sidebar (show icons with text)" 
                : "Collapse sidebar (icons only)"
          }>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={onDrawerToggle}
              sx={{ 
                mr: 2,
                display: 'flex',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.2s ease',
                borderRadius: 2,
                p: 1.2,
              }}
            >
              {!isMobile && sidebarCollapsed ? (
                <MenuOpenIcon sx={{ fontSize: 24 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 24 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Title Only */}
          <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                HealthCare Pro
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
                Management System
              </Typography>
            </Box>
          </Box>

          {/* Page Title */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 3 }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 'medium',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {getPageTitle()}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Auth Status */}
          <Chip 
            label={authEnabled ? (isAuthenticated ? "Authenticated" : "Not Authenticated") : "Public Mode"} 
            size="small" 
            sx={{ 
              bgcolor: authEnabled ? (isAuthenticated ? 'success.main' : 'warning.main') : 'info.main', 
              color: 'white',
              display: { xs: 'none', sm: 'flex' }
            }} 
          />

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* Notifications - only show when authenticated */}
          {isAuthenticated && (
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleNotificationMenuOpen}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* Authentication Section */}
          {isAuthenticated ? (
            <Tooltip title="Account settings">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'secondary.main',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    currentUser.name.split(' ').map(n => n[0]).join('')
                  )}
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : authEnabled ? (
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          ) : null}
        </Box>

        {/* Profile Menu - only show when authenticated */}
        {isAuthenticated && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 250,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            <Box px={2} py={1} borderBottom={1} borderColor="divider">
              <Typography variant="subtitle2" fontWeight="bold">
                {currentUser.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser.role} • {currentUser.department}
              </Typography>
              {currentUser.email && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {currentUser.email}
                </Typography>
              )}
            </Box>
            
            <MenuItem>
              <AccountCircle sx={{ mr: 1 }} />
              Profile Settings
            </MenuItem>
            <MenuItem>
              <Settings sx={{ mr: 1 }} />
              System Settings
            </MenuItem>
            <MenuItem>
              <Help sx={{ mr: 1 }} />
              Help & Support
            </MenuItem>
            {authEnabled && (
              <MenuItem sx={{ color: 'error.main' }} onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Sign Out
              </MenuItem>
            )}
          </Menu>
        )}

        {/* Notifications Menu - only show when authenticated */}
        {isAuthenticated && (
          <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 300,
              maxHeight: 400,
            },
          }}
        >
          <Box px={2} py={1} borderBottom={1} borderColor="divider">
            <Typography variant="subtitle2" fontWeight="bold">
              Notifications
            </Typography>
          </Box>
          
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                New appointment scheduled
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Patient John Doe - 2:00 PM today
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Lab results ready
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Patient Sarah Smith - Blood work complete
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                System maintenance scheduled
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tonight 11:00 PM - 2:00 AM
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;