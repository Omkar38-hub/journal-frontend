import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography, Box, TextField, Button, Avatar, Grid, Switch, FormControlLabel,
  Alert, CircularProgress, Paper, Divider, Chip, List, ListItem, ListItemIcon, 
  ListItemText, Badge
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Profile() {
  const { user, login, token, role, setRole } = useAuth();
  const navigate = useNavigate();
  
  // Profile form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [sentiment, setSentiment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  // Fetch user data on component mount - only once
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.username || isInitialized) return;
      
      setLoading(true);
      try {
        const response = await api.get('/user');
        const userData = response.data;
        
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setSentiment(userData.sentimentAnalysis || false);
        setIsInitialized(true);
        
        // Update auth context with fresh data
        login(userData, token, role);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to fetch user data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.username, isInitialized, login, token, role]);

  // Initialize role if not set
  useEffect(() => {
    if (user?.roles && user.roles.length > 0 && !role) {
      setRole(user.roles[0]);
    }
  }, [user?.roles, role, setRole]);

  // Handle profile update
  const handleProfileUpdate = useCallback(async () => {
    // Validation
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/user', {
        username: username.trim(),
        email: email.trim(),
        sentimentAnalysis: sentiment
      });

      // Update auth context with the returned user data
      if (response.data) {
        login(response.data, token, role);
      } else {
        // Fallback: update with current form data
        login({
          ...user,
          email: email.trim(),
          sentimentAnalysis: sentiment
        }, token, role);
      }
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.response?.status === 403) {
        setError('Access denied. Please check your authentication and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [username, email, sentiment, login, token, role, user]);

  // Handle password change
  const handlePasswordChange = useCallback(async (e) => {
    e.preventDefault();
    
    // Validation
    if (!currentPassword.trim()) {
      setPwError('Current password is required.');
      return;
    }
    
    if (!newPassword.trim()) {
      setPwError('New password is required.');
      return;
    }
    
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters long.');
      return;
    }

    setPwLoading(true);
    setPwError('');
    setPwSuccess('');

    try {
      await api.put('/user/password', {
        currentPassword: currentPassword.trim(),
        password: newPassword.trim()
      });

      setPwSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setPwSuccess(''), 3000);
    } catch (err) {
      console.error('Password change error:', err);
      setPwError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setPwLoading(false);
    }
  }, [currentPassword, newPassword]);

  // Handle role switching with navigation
  const handleRoleSwitch = useCallback((newRole) => {
    if (user?.roles?.includes(newRole)) {
      setRole(newRole);
      
      // Navigate based on the new role
      if (newRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user?.roles, setRole, navigate]);

  // Handle sentiment toggle
  const handleSentimentToggle = useCallback((event) => {
    setSentiment(event.target.checked);
  }, []);

  // Get role chip component
  const getRoleChip = useCallback((roleName) => {
    const isActive = role === roleName;
    return (
      <Chip
        key={roleName}
        label={roleName}
        color={isActive ? 'primary' : 'default'}
        variant={isActive ? 'filled' : 'outlined'}
        icon={roleName === 'ADMIN' ? <AdminIcon /> : <PersonIcon />}
        sx={{ 
          fontWeight: isActive ? 600 : 500,
          '& .MuiChip-icon': { color: isActive ? 'white' : 'inherit' }
        }}
      />
    );
  }, [role]);

  // Check if user has multiple roles
  const hasMultipleRoles = user?.roles && Array.isArray(user.roles) && user.roles.length > 1;

  // Loading state
  if (loading && !isInitialized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        background: '#f4f6f8'
      }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, background: '#f4f6f8', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage your account information and preferences
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display='flex' alignItems='center' mb={3}>
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar sx={{ width: 20, height: 20, bgcolor: 'success.main' }}>
                    <SecurityIcon sx={{ fontSize: 12 }} />
                  </Avatar>
                }
              >
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                  {username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </Badge>
              <Box ml={3} minWidth={0}>
                <Typography variant='h6' fontWeight='bold' noWrap={false} sx={{ wordWrap: 'break-word' }}>
                  {username || 'Username not set'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {getRoleChip(role || 'USER')}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Username" 
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word' }}>
                      {username || 'Not set'}
                    </Typography>
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word' }}>
                      {email || 'Not set'}
                    </Typography>
                  } 
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <InfoIcon color='primary' />
                </ListItemIcon>
                <ListItemText 
                  primary='Account Status' 
                  secondary='Active'
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  secondaryTypographyProps={{ variant: 'body2', color: 'success.main' }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color='primary' />
                </ListItemIcon>
                <ListItemText 
                  primary='Sentiment Analysis' 
                  secondary={
                    <Chip
                      label={sentiment ? 'Enabled' : 'Disabled'}
                      color={sentiment ? 'success' : 'default'}
                      size='small'
                      variant='outlined'
                    />
                  }
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Edit Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display='flex' alignItems='center' mb={3}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}><EditIcon /></Avatar>
              <Typography variant='h6' fontWeight='bold'>Edit Profile</Typography>
            </Box>
            
            {error && (
              <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity='success' sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <TextField
                label='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin='normal'
                disabled
                sx={{ mb: 2 }}
              />
              
              <TextField
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin='normal'
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={sentiment}
                    onChange={handleSentimentToggle}
                    name='sentimentAnalysis'
                    color='primary'
                  />
                }
                label='Enable Sentiment Analysis'
                sx={{ mb: 3 }}
              />
              
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2, flexGrow: 1 }}>
                When enabled, your journal entries will be analyzed for emotional sentiment.
              </Typography>

              <Button 
                onClick={handleProfileUpdate}
                variant='contained' 
                disabled={loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  mt: 'auto'
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display='flex' alignItems='center' mb={3}>
              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}><LockIcon /></Avatar>
              <Typography variant='h6' fontWeight='bold'>Change Password</Typography>
            </Box>
            
            {pwError && (
              <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }} onClose={() => setPwError('')}>
                {pwError}
              </Alert>
            )}
            {pwSuccess && (
              <Alert severity='success' sx={{ mb: 2, borderRadius: 2 }} onClose={() => setPwSuccess('')}>
                {pwSuccess}
              </Alert>
            )}
            
            <Box component='form' onSubmit={handlePasswordChange} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <TextField
                label='Current Password'
                type='password'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label='New Password'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
                sx={{ mb: 3 }}
              />
              
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2, flexGrow: 1 }}>
                Password must be at least 6 characters long.
              </Typography>

              <Button 
                type='submit'
                variant='contained' 
                color='secondary' 
                disabled={pwLoading}
                fullWidth
                startIcon={pwLoading ? <CircularProgress size={20} /> : <LockIcon />}
                sx={{ 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  mt: 'auto'
                }}
              >
                {pwLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Role Management Card - Only show if user has multiple roles */}
        {hasMultipleRoles && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
              <Box display='flex' alignItems='center' mb={3}>
                <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}><SecurityIcon /></Avatar>
                <Typography variant='h6' fontWeight='bold'>Role Management</Typography>
              </Box>
              
              <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
                You have access to multiple roles. Switch between them to access different features.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Available Roles:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                  {user?.roles?.map(roleName => getRoleChip(roleName))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={role === 'ADMIN'}
                    onChange={(e) => handleRoleSwitch(e.target.checked ? 'ADMIN' : 'USER')}
                    name='roleSwitch'
                    color='warning'
                    disabled={!user?.roles?.includes('ADMIN') || !user?.roles?.includes('USER')}
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1' fontWeight='bold'>
                      {role === 'ADMIN' ? 'Administrator View' : 'User View'}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {role === 'ADMIN' 
                        ? 'Access to user management and system administration' 
                        : 'Standard user features and journal management'}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start' }}
              />

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  <strong>Current View:</strong> {role === 'ADMIN' 
                    ? 'You are in administrator mode. You can manage users, view system statistics, and access administrative features.' 
                    : 'You are in user mode. You can manage your journal entries and personal settings.'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Profile;
