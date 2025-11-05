import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Toolbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  LocalHospital as LocalHospitalIcon,
  Medication as MedicationIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Logo from '../common/Logo';

const drawerWidth = 240;
const collapsedDrawerWidth = 72;

const menuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'Patients', icon: PeopleIcon, path: '/patients' },
  { text: 'Doctors', icon: LocalHospitalIcon, path: '/doctors' },
  { text: 'Appointments', icon: CalendarTodayIcon, path: '/appointments' },
  { text: 'Prescriptions', icon: MedicationIcon, path: '/prescriptions' },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: sidebarCollapsed ? 1 : 2, 
        textAlign: 'center', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        transition: 'padding 0.3s ease'
      }}>
        <Logo 
          size={sidebarCollapsed ? "small" : "medium"} 
          variant={sidebarCollapsed ? "icon" : "full"} 
        />
      </Box>
      <List sx={{ flexGrow: 1, py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  px: sidebarCollapsed ? 1 : 2,
                  minHeight: 48,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarCollapsed ? 'auto' : 56,
                    mr: sidebarCollapsed ? 0 : 3,
                    justifyContent: 'center',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default' 
    }}>
      <Header onDrawerToggle={handleDrawerToggle} sidebarCollapsed={sidebarCollapsed} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width: isMobile ? drawerWidth : (sidebarCollapsed ? collapsedDrawerWidth : drawerWidth),
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
              width: isMobile ? drawerWidth : (sidebarCollapsed ? collapsedDrawerWidth : drawerWidth),
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: 'background.paper',
              marginTop: '64px', // Account for fixed header
              height: 'calc(100vh - 64px)',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { 
              xs: '100%',
              sm: `calc(100% - ${isMobile ? drawerWidth : (sidebarCollapsed ? collapsedDrawerWidth : drawerWidth)}px)` 
            },
            marginTop: '64px', // Account for fixed header
            minHeight: 'calc(100vh - 164px)', // Account for header and footer
            bgcolor: 'background.default',
            transition: 'width 0.3s ease',
          }}
        >
          <Box sx={{ p: 3, minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </Box>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}