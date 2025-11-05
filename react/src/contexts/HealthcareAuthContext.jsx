import React, { createContext, useContext, useMemo } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { AppConfig } from '../config';

// Create context for healthcare-specific auth features
const HealthcareAuthContext = createContext();

// Healthcare Auth Provider that wraps Asgardeo auth
export const HealthcareAuthProvider = ({ children }) => {
  const { state, signIn, signOut, getAccessToken, getDecodedIDToken } = useAuthContext();

  const isAuthenticated = useMemo(
    () => (AppConfig.USE_AUTH ? state?.isAuthenticated : true),
    [state]
  );

  const user = useMemo(() => {
    if (AppConfig.USE_AUTH && state?.isAuthenticated) {
      return {
        name: state.displayName || state.username || 'Healthcare User',
        email: state.email || 'user@healthcare.com',
        role: 'Doctor', // Default role, can be extracted from token claims
        department: 'General Medicine',
        id: state.sub || 'user-123',
        avatar: null
      };
    }
    // Mock user when authentication is disabled
    return {
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@healthcare.com',
      role: 'Administrator',
      department: 'Cardiology',
      id: 'demo-user',
      avatar: null
    };
  }, [state]);

  const username = useMemo(
    () => (AppConfig.USE_AUTH ? state?.username : "Guest"),
    [state]
  );

  const isLoading = useMemo(
    () => (AppConfig.USE_AUTH ? state?.isLoading : false),
    [state]
  );

  const login = async () => {
    if (AppConfig.USE_AUTH) {
      await signIn();
    }
  };

  const logout = async () => {
    if (AppConfig.USE_AUTH) {
      await signOut();
    }
  };

  const getToken = async () => {
    if (AppConfig.USE_AUTH && getAccessToken) {
      return await getAccessToken();
    }
    return null;
  };

  const getUserClaims = async () => {
    if (AppConfig.USE_AUTH && getDecodedIDToken) {
      return await getDecodedIDToken();
    }
    return null;
  };

  const value = {
    // Auth state
    isAuthenticated,
    isLoading,
    user,
    username,
    
    // Auth methods
    login,
    logout,
    signIn: login,
    signOut: logout,
    
    // Token methods
    getToken,
    getAccessToken: getToken,
    getUserClaims,
    
    // Config
    authEnabled: AppConfig.USE_AUTH,
    authProvider: AppConfig.AUTH_BY
  };

  return (
    <HealthcareAuthContext.Provider value={value}>
      {children}
    </HealthcareAuthContext.Provider>
  );
};

// Hook to use healthcare auth context
export const useAuth = () => {
  const context = useContext(HealthcareAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a HealthcareAuthProvider');
  }
  return context;
};

// Legacy export for backward compatibility
export const AuthProvider = HealthcareAuthProvider;