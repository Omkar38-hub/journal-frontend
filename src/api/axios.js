import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080', // Use env variable, fallback to localhost
});

// Create a custom event for token expiration
const createTokenExpiredEvent = () => {
  return new CustomEvent('tokenExpired', {
    detail: { message: 'Your session has expired. Please login again.' }
  });
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Sending request with token:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token expired or invalid:', error.response);
      
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      
      // Dispatch token expired event
      window.dispatchEvent(createTokenExpiredEvent());
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
    } else if (error.response?.status === 403) {
      console.error('403 Forbidden - Authentication issue:', error.response);
      
      // Check if it's a JWT-related error
      if (error.response.data?.message?.includes('JWT') || 
          error.response.data?.message?.includes('token') ||
          error.response.data?.message?.includes('expired')) {
        
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        
        // Dispatch token expired event
        window.dispatchEvent(createTokenExpiredEvent());
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 