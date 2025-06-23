// Token utility functions

/**
 * Check if a JWT token is expired by decoding it
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode the JWT token (without verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Consider invalid tokens as expired
  }
};

/**
 * Get token expiration time
 * @param {string} token - The JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
};

/**
 * Get time until token expires in milliseconds
 * @param {string} token - The JWT token
 * @returns {number} - Milliseconds until expiration, negative if expired
 */
export const getTimeUntilExpiration = (token) => {
  if (!token) return -1;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return (payload.exp - currentTime) * 1000;
  } catch (error) {
    console.error('Error calculating time until expiration:', error);
    return -1;
  }
};

/**
 * Check if token will expire soon (within the next 5 minutes)
 * @param {string} token - The JWT token
 * @param {number} warningTime - Warning time in milliseconds (default: 5 minutes)
 * @returns {boolean} - True if token expires soon
 */
export const isTokenExpiringSoon = (token, warningTime = 5 * 60 * 1000) => {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  return timeUntilExpiration > 0 && timeUntilExpiration < warningTime;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

/**
 * Get stored token from localStorage
 * @returns {string|null} - The stored token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Store token in localStorage
 * @param {string} token - The token to store
 */
export const storeToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
}; 