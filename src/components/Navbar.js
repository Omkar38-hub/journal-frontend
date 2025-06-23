import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, useTheme, useMediaQuery, CssBaseline, Divider
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as JournalIcon,
  Person as ProfileIcon,
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const navItems = {
  USER: [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <JournalIcon />, link: '/journal' },
    { text: 'Profile', icon: <ProfileIcon />, link: '/profile' },
  ],
  ADMIN: [
    { text: 'Admin Dashboard', icon: <AdminIcon />, link: '/admin' },
    { text: 'User Management', icon: <PeopleIcon />, link: '/admin/users' },
  ],
  PUBLIC: [
    { text: 'Login', icon: <LoginIcon />, link: '/login' },
    { text: 'Signup', icon: <PersonAddIcon />, link: '/signup' },
  ],
};

function Navbar() {
  const { token, role, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          Journal App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {token && navItems[role]?.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link} onClick={isMobile ? handleDrawerToggle : undefined}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {!token && navItems.PUBLIC.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link} onClick={isMobile ? handleDrawerToggle : undefined}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {token && (
        <>
            <Divider sx={{ mt: 'auto' }}/>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
      )}
    </div>
  );

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* This could be dynamic based on the page */}
          </Typography>
          {token && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Typography>Hi, {user?.username}!</Typography>
                 <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar; 