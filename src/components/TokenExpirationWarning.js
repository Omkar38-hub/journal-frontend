import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  Button, 
  Box,
  LinearProgress 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TokenExpirationWarning = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const { handleTokenExpiration } = useAuth();

  useEffect(() => {
    const handleTokenExpiringSoon = (event) => {
      setMessage(event.detail.message);
      setTimeLeft(event.detail.timeLeft);
      setOpen(true);
    };

    window.addEventListener('tokenExpiringSoon', handleTokenExpiringSoon);
    
    return () => {
      window.removeEventListener('tokenExpiringSoon', handleTokenExpiringSoon);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    handleTokenExpiration();
  };

  // Calculate progress for the progress bar (0 to 100)
  const progress = timeLeft > 0 ? Math.max(0, Math.min(100, (timeLeft / (5 * 60 * 1000)) * 100)) : 0;

  return (
    <Snackbar
      open={open}
      autoHideDuration={null} // Don't auto-hide
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="warning" 
        sx={{ 
          width: '100%',
          minWidth: '400px',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleLogout}
            variant="contained"
          >
            Logout Now
          </Button>
        }
      >
        <Box sx={{ width: '100%' }}>
          <div>{message}</div>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              mt: 1, 
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 193, 7, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ff9800'
              }
            }} 
          />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default TokenExpirationWarning; 