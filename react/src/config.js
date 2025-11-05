import configJson from "./config.json";

/**
 * Authentication Provider Selection
 * 
 * Determines which authentication configuration to use from config.json.
 * Available options:
 * - "WSO2_APIM_KM": WSO2 API Manager Key Manager
 * - "WSO2_IS_KM": WSO2 Identity Server Key Manager  
 * - "ASGARDEO_KM": Asgardeo Key Manager
 * - "WSO2_IS": WSO2 Identity Server
 * - "ASGARDEO": Asgardeo Identity Provider
 * - "NO_AUTH": No authentication (public access)
 */
const AUTH_BY = "NO_AUTH"; // Default to no authentication for healthcare app

/**
 * Application Configuration Export
 * 
 * Consolidates all configuration settings from the selected auth provider
 * into a single exported object for easy consumption throughout the app.
 */
export const AppConfig = {
  // Whether authentication is required for API access
  USE_AUTH: configJson[AUTH_BY].USE_AUTH,
  
  // The currently selected authentication provider
  AUTH_BY,
  
  // The currently selected authentication provider
  TYPE: configJson[AUTH_BY].TYPE,
  
  // Base URL for all API endpoints (healthcare backend)
  API_BASE_URL: configJson[AUTH_BY].API_BASE_URL,
  
  // Complete authentication configuration for the selected provider
  // Includes clientID, baseUrl, redirect URLs, etc.
  AuthConfig: configJson[AUTH_BY]
};