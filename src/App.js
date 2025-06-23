import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import TokenExpirationNotification from './components/TokenExpirationNotification';
import TokenExpirationWarning from './components/TokenExpirationWarning';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import { CssBaseline, Box } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <TokenExpirationNotification />
        <TokenExpirationWarning />
        <Box sx={{ display: 'flex' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: '100%' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><UserManagement /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App; 