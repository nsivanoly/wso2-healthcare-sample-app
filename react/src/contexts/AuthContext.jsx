import React, { createContext, useContext, useState } from 'react';

// Simple mock auth context for demo purposes
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock auth provider - no real authentication
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState({
    id: 'demo-user-1',
    username: 'demo_user',
    email: 'demo@healthcare.com',
    firstName: 'Demo',
    lastName: 'User',
    fullName: 'Demo User',
    department: 'Healthcare'
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const authContextValue = {
    user,
    isAuthenticated,
    isLoading: false,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock theme toggle context
const ThemeToggleContext = createContext();

export const useThemeToggle = () => {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error('useThemeToggle must be used within a ThemeToggleProvider');
  }
  return context;
};

export const ThemeToggleProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeToggleContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeToggleContext.Provider>
  );
};