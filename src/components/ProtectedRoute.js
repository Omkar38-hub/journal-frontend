import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

function ProtectedRoute({ children, adminOnly = false }) {
  const { token, role, isLoading, handleTokenExpiration } = useAuth();

  // Listen for token expiration events
  useEffect(() => {
    const handleTokenExpired = (event) => {
      console.log('Token expired event received:', event.detail.message);
      handleTokenExpiration();
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [handleTokenExpiration]);

  // Show loading spinner while validating token
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Validating your session...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admin users away from admin routes
  if (adminOnly && role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute; 