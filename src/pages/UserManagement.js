import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AlternateEmail as AlternateEmailIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JournalDetailModal from '../components/JournalDetailModal';
import { getSentimentStyle } from '../utils/sentimentUtils';

const UserCard = ({ user, onView, onDelete, currentUser }) => (
  <Card sx={{
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 4,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      zIndex: 10,
    },
  }}>
    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.dark', color: 'common.white', fontSize: '1.75rem', fontWeight: 'bold' }}>
          {user.username?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            {user.email || 'No email provided'}
          </Typography>
        </Box>
      </Stack>

      {user.roles?.includes('ADMIN') && (
        <Chip 
          icon={<AdminPanelSettingsIcon />} 
          label="Administrator" 
          color="primary"
          variant="outlined"
          size="small"
          sx={{ mb: 2, width: 'fit-content' }} 
        />
      )}

      <Divider sx={{ my: 1.5 }} />

      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Journal Entries</Typography>
          <Typography variant="h6" fontWeight="bold">{user.journalEntryList?.length || 0}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Sentiment Analysis</Typography>
          <Chip 
            label={user.sentimentAnalysis ? 'Active' : 'Inactive'}
            color={user.sentimentAnalysis ? 'success' : 'default'}
            size="small"
            variant="filled"
          />
        </Box>
      </Stack>
    </CardContent>

    <CardActions sx={{ 
        justifyContent: 'flex-end', 
        p: 1.5, 
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderTop: '1px solid rgba(0,0,0,0.05)'
    }}>
      <Button size="small" variant="text" startIcon={<ViewIcon />} onClick={() => onView(user)}>
        Details
      </Button>
      <Button 
        size="small" 
        color="error" 
        variant="text"
        startIcon={<DeleteIcon />} 
        onClick={() => onDelete(user.id)}
        disabled={user.username === currentUser?.username}
      >
        Delete
      </Button>
    </CardActions>
  </Card>
);

const JournalCard = ({ journal, onClick }) => {
  const date = new Date(journal.date);
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  const sentimentStyle = getSentimentStyle(journal.sentiment);

  return (
    <Paper
      onClick={onClick}
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'box-shadow 0.3s ease, border-left-width 0.3s ease, border-color 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid transparent',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          borderLeftColor: 'primary.main',
        }
      }}
    >
      <Box sx={{ textAlign: 'center', flexShrink: 0, width: 50 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">
          {month}
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          {day}
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
          {journal.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '40px',
          my: 0.5,
          wordBreak: 'break-word',
        }}>
          {journal.content}
        </Typography>
        {journal.sentiment && (
          <Chip 
            icon={sentimentStyle.icon}
            label={sentimentStyle.label}
            color={sentimentStyle.color} 
            size="small" 
            variant="outlined" 
          />
        )}
      </Box>
    </Paper>
  );
};

function UserManagement() {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/all-users');
      const userList = Array.isArray(res.data) ? res.data : [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (err) {
      setError('Failed to fetch users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => 
        user.roles?.includes(roleFilter)
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleDeleteUser = async (userId) => {
    if (users.find(u => u.id === userId)?.username === user?.username) {
      setError('You cannot delete your own account.');
      return;
    }
    const userForDeletion = users.find(u => u.id === userId);
    setDeleteUserId(userForDeletion.id);
    setConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await api.delete(`/admin/id/${deleteUserId}`);
      setSuccess(`User '${users.find(u => u.id === deleteUserId)?.username}' deleted successfully!`);
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setConfirmDeleteDialogOpen(false);
      setDeleteUserId(null);
    }
  };

  const handleViewUser = (userItem) => {
    setSelectedUser(userItem);
  };

  const handleViewJournal = (journal) => {
    setSelectedJournal(journal);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'USER': return 'primary';
      default: return 'default';
    }
  };

  const getSentimentColor = (enabled) => {
    return enabled ? 'success' : 'default';
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        background: '#f4f6f8'
      }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, background: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all users in your application. Total users: {users.length}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => {
              login({
                ...user,
                email: user?.email,
                sentimentAnalysis: user?.sentimentAnalysis,
                roles: user?.roles,
              }, token, 'USER');
              navigate('/dashboard');
            }}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Switch to User
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon sx={{ fontSize: '1rem' }} />
              Search and filter users with advanced controls
            </Typography>
          </Box>
          <Box display="flex" gap={1.5}>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              size="medium"
              onClick={() => setViewMode('table')}
              startIcon={<DashboardIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&.MuiButton-contained': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-1px)'
                  }
                },
                '&.MuiButton-outlined': {
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    transform: 'translateY(-1px)'
                  }
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Table View
            </Button>
            <Button
              variant={viewMode === 'card' ? 'contained' : 'outlined'}
              size="medium"
              onClick={() => setViewMode('card')}
              startIcon={<GroupIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&.MuiButton-contained': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-1px)'
                  }
                },
                '&.MuiButton-outlined': {
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    transform: 'translateY(-1px)'
                  }
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Card View
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or email..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0,0,0,0.12)',
                    borderWidth: '1px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }
              }}
              InputLabelProps={{
                sx: {
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: 'primary.main',
                    fontWeight: 600
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: 'text.secondary', 
                fontWeight: 500,
                '&.Mui-focused': {
                  color: 'primary.main',
                  fontWeight: 600
                }
              }}>
                Filter by Role
              </InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0,0,0,0.12)',
                    borderWidth: '1px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }}
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                <MenuItem value="USER">Users Only</MenuItem>
                <MenuItem value="ADMIN">Admins Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  borderColor: 'rgba(0,0,0,0.2)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'text.primary',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchUsers}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          sx={{
            p: 2.5,
            borderRadius: 2,
            backgroundColor: 'rgba(59, 130, 246, 0.02)',
            border: '1px solid',
            borderColor: 'rgba(59, 130, 246, 0.1)'
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'primary.main',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              <GroupIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Showing {filteredUsers.length} of {users.length} total users
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${viewMode === 'table' ? 'Table' : 'Card'} View`}
            color="primary"
            variant="filled"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>

        {viewMode === 'card' ? (
          <Grid container spacing={3}>
            {filteredUsers.map((userItem) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={userItem.id}>
                <UserCard 
                  user={userItem} 
                  onView={handleViewUser}
                  onDelete={handleDeleteUser}
                  currentUser={user}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      py: 2
                    }}>
                      User
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      py: 2
                    }}>
                      Roles
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      py: 2
                    }}>
                      Journal Entries
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      py: 2
                    }}>
                      Sentiment Analysis
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      py: 2
                    }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((userItem, index) => (
                    <TableRow 
                      key={userItem.id} 
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.2s ease-in-out'
                        },
                        transition: 'all 0.2s ease-in-out',
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(0,0,0,0.01)'
                        }
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 48, 
                              height: 48, 
                              mr: 2.5, 
                              bgcolor: 'primary.main',
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                            }}
                          >
                            {userItem.username?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="body1" 
                              fontWeight={600}
                              sx={{ 
                                color: 'text.primary',
                                mb: 0.5,
                                fontSize: '1rem'
                              }}
                            >
                              {userItem.username}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <AlternateEmailIcon sx={{ fontSize: '0.875rem' }} />
                              {userItem.email || 'No email provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box display="flex" gap={0.75} flexWrap="wrap">
                          {userItem.roles?.map(role => (
                            <Chip
                              key={role}
                              label={role}
                              color={getRoleColor(role)}
                              size="small"
                              variant="filled"
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-label': {
                                  px: 1.5
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <NotesIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.primary',
                              fontWeight: 500,
                              fontSize: '0.875rem'
                            }}
                          >
                            {userItem.journalEntryList?.length || 0} entries
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip
                          label={userItem.sentimentAnalysis ? 'Enabled' : 'Disabled'}
                          color={getSentimentColor(userItem.sentimentAnalysis)}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                            '& .MuiChip-label': {
                              px: 1.5
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2.5 }}>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <Tooltip title="View User Details" arrow>
                            <IconButton
                              size="medium"
                              onClick={() => handleViewUser(userItem)}
                              sx={{ 
                                color: 'primary.main',
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.16)',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User" arrow>
                            <IconButton
                              color="error"
                              size="medium"
                              onClick={() => handleDeleteUser(userItem.id)}
                              disabled={userItem.username === user?.username}
                              sx={{ 
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                '&:hover': { 
                                  backgroundColor: 'rgba(211, 47, 47, 0.16)',
                                  transform: 'scale(1.05)'
                                },
                                '&:disabled': {
                                  backgroundColor: 'rgba(0,0,0,0.04)',
                                  color: 'rgba(0,0,0,0.26)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      <JournalDetailModal 
        journal={selectedJournal}
        open={!!selectedJournal}
        onClose={() => setSelectedJournal(null)}
      />

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: 4, height: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', p: 3, background: '#f4f6f8' }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', mr: 2 }}>
            {selectedUser?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            User Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Profile</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Username" secondary={selectedUser.username} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AlternateEmailIcon /></ListItemIcon>
                    <ListItemText primary="Email" secondary={selectedUser.email || 'N/A'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                    <ListItemText primary="Roles" secondary={selectedUser.roles?.join(', ')} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Journal Entries ({selectedUser.journalEntryList?.length || 0})</Typography>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto', p: 1 }}>
                  {selectedUser.journalEntryList?.length > 0 ? (
                    selectedUser.journalEntryList.map(journal => (
                      <JournalCard key={journal.id} journal={journal} onClick={() => handleViewJournal(journal)} />
                    ))
                  ) : (
                    <Typography>No journal entries found for this user.</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setSelectedUser(null)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to permanently delete the user{' '}
            <strong>{users.find(u => u.id === deleteUserId)?.username}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement; 