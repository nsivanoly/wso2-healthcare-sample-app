import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('healthcare-theme-mode');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('healthcare-theme-mode', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2E7D32', // Medical green
        light: '#60AD5E',
        dark: '#1B5E20',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#1976D2', // Professional blue
        light: '#42A5F5',
        dark: '#1565C0',
        contrastText: '#ffffff',
      },
      success: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
      },
      error: {
        main: '#D32F2F',
        light: '#EF5350',
        dark: '#C62828',
      },
      warning: {
        main: '#ED6C02',
        light: '#FF9800',
        dark: '#E65100',
      },
      info: {
        main: '#0288D1',
        light: '#03DAC6',
        dark: '#01579B',
      },
      background: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            background: 'linear-gradient(45deg, #2E7D32, #1976D2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1B5E20, #1565C0)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover fieldset': {
                borderColor: '#2E7D32',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2E7D32',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#4CAF50', // Lighter green for dark mode
        light: '#81C784',
        dark: '#2E7D32',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#42A5F5', // Lighter blue for dark mode
        light: '#90CAF9',
        dark: '#1976D2',
        contrastText: '#ffffff',
      },
      success: {
        main: '#66BB6A',
        light: '#A5D6A7',
        dark: '#4CAF50',
      },
      error: {
        main: '#EF5350',
        light: '#FFCDD2',
        dark: '#D32F2F',
      },
      warning: {
        main: '#FF9800',
        light: '#FFE0B2',
        dark: '#ED6C02',
      },
      info: {
        main: '#29B6F6',
        light: '#B3E5FC',
        dark: '#0288D1',
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
            },
          },
          contained: {
            background: 'linear-gradient(45deg, #4CAF50, #42A5F5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #66BB6A, #64B5F6)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover fieldset': {
                borderColor: '#4CAF50',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4CAF50',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

  const theme = darkMode ? darkTheme : lightTheme;

  const value = {
    darkMode,
    toggleDarkMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};