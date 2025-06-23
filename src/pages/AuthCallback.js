import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token && role) {
      // Store the authentication data
      login({ username: 'Google User' }, token, role);
      
      // Redirect based on role
      setTimeout(() => {
        if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } else {
      setError('Authentication failed. Missing token or role.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate, login]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#f4f6f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="sm">
        <Card sx={{
          borderRadius: 4,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          background: 'white',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
          }
        }}>
          {/* Header Section */}
          <Box sx={{
            background: 'linear-gradient(135deg, #388E3C 0%, #FFC107 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center'
          }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              width: 64, 
              height: 64,
              margin: '0 auto 16px',
              backdropFilter: 'blur(10px)'
            }}>
              {loading ? (
                <CircularProgress size={32} sx={{ color: 'white' }} />
              ) : error ? (
                <ErrorIcon sx={{ fontSize: 32 }} />
              ) : (
                <CheckCircleIcon sx={{ fontSize: 32 }} />
              )}
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {loading ? 'Authenticating...' : error ? 'Authentication Failed' : 'Authentication Successful!'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {loading 
                ? 'Please wait while we complete your sign-in' 
                : error 
                  ? 'Something went wrong with the authentication process'
                  : 'Welcome to your journaling journey!'
              }
            </Typography>
          </Box>

          {/* Content Section */}
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {error && (
              <Alert severity="error" sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': { color: '#d32f2f' }
              }}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box sx={{ py: 4 }}>
                <CircularProgress size={60} sx={{ color: '#388E3C', mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Redirecting to dashboard...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ py: 4 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Redirecting to login page...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 4 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Redirecting to dashboard...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AuthCallback; 