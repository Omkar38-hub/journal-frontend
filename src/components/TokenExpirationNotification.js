import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  Button, 
  Box 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TokenExpirationNotification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { handleTokenExpiration } = useAuth();

  useEffect(() => {
    const handleTokenExpired = (event) => {
      setMessage(event.detail.message);
      setOpen(true);
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    handleTokenExpiration();
  };

  const handleRelogin = () => {
    setOpen(false);
    handleTokenExpiration();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000} // 10 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="warning" 
        sx={{ width: '100%' }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRelogin}
              variant="outlined"
            >
              Login Again
            </Button>
          </Box>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default TokenExpirationNotification; 