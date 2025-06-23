import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Notes as NotesIcon,
  CalendarToday as CalendarTodayIcon,
  Visibility as VisibilityIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import JournalDetailModal from '../components/JournalDetailModal';
import { getSentimentStyle } from '../utils/sentimentUtils';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ 
      borderRadius: 4, 
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      background: `linear-gradient(135deg, ${color}99, ${color}66)`,
      color: 'white',
      height: '100%'
  }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h3" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 60, height: 60 }}>
          {React.cloneElement(icon, { style: { fontSize: 32, color: 'white' } })}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const QuickActionCard = ({ title, description, icon, onClick, color }) => (
    <Card 
      onClick={onClick}
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 60, height: 60, margin: '0 auto 16px' }}>
            {icon}
        </Avatar>
        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
);

const JournalCarouselCard = ({ journal, onClick }) => {
  const date = new Date(journal.date);
  const sentimentStyle = getSentimentStyle(journal.sentiment);

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        height: { xs: 200, sm: 220, md: 240 },
        cursor: 'pointer',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          borderColor: 'primary.main',
          '& .journal-overlay': {
            opacity: 1,
          },
        },
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
      <CardContent sx={{ 
        p: { xs: 1.5, md: 2.5 }, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Header with user info and date */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ 
              width: { xs: 28, md: 32 }, 
              height: { xs: 28, md: 32 }, 
              bgcolor: 'primary.main',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              {journal.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                {journal.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
                {date.toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        {/* Journal Title */}
        <Typography 
          variant="h6" 
          fontWeight={700} 
          sx={{ 
            mb: 1.5,
            color: 'text.primary',
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: { xs: '2.2rem', md: '2.4rem' }
          }}
        >
          {journal.title}
        </Typography>

        {/* Journal Content Preview */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
            mb: 1.5,
            minHeight: { xs: '3.8rem', md: '4rem' },
            fontSize: { xs: '0.8rem', md: '0.9rem' }
          }}
        >
          {journal.content}
        </Typography>

        {/* Footer with sentiment */}
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt="auto">
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
      </CardContent>

      {/* Hover overlay */}
      <Box
        className="journal-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" color="white">
          <VisibilityIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            View Details
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

const WeeklyMoodChart = ({ data, loading }) => {
  const formatData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(day => ({
      date: day.date,
      Happy: day.sentiments?.HAPPY || 0,
      Pleasant: day.sentiments?.PLEASANT || 0,
      Calm: day.sentiments?.CALM || 0,
      Neutral: day.sentiments?.NEUTRAL || 0,
      Sad: day.sentiments?.SAD || 0,
      Angry: day.sentiments?.ANGRY || 0,
    }));
  };

  const chartData = formatData(data);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          stroke="#666"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#666"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{ paddingBottom: 10 }}
        />
        <Line 
          type="monotone" 
          dataKey="Happy" 
          stroke="#4caf50" 
          strokeWidth={3}
          dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="Pleasant" 
          stroke="#2196f3" 
          strokeWidth={3}
          dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="Calm" 
          stroke="#00bcd4" 
          strokeWidth={3}
          dot={{ fill: '#00bcd4', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#00bcd4', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="Neutral" 
          stroke="#9e9e9e" 
          strokeWidth={3}
          dot={{ fill: '#9e9e9e', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#9e9e9e', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="Sad" 
          stroke="#ff9800" 
          strokeWidth={3}
          dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="Angry" 
          stroke="#f44336" 
          strokeWidth={3}
          dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#f44336', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

function AdminDashboard() {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalJournals: 0,
  });
  const [recentJournals, setRecentJournals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [slideDirection, setSlideDirection] = useState('right');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [confirmRoleChangeDialogOpen, setConfirmRoleChangeDialogOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState({ username: '' });
  const [selectedRoles, setSelectedRoles] = useState(['USER']);
  const [userEmail, setUserEmail] = useState('');
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);
  const [weeklyMoodData, setWeeklyMoodData] = useState([]);
  const [moodChartLoading, setMoodChartLoading] = useState(false);

  // Available roles
  const availableRoles = ['USER', 'ADMIN'];

  // Fetch all users and calculate stats
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/all-users');
      const userList = Array.isArray(res.data) ? res.data : [];
      setUsers(userList);
      
      // Calculate statistics
      const totalUsers = userList.length;
      const totalAdmins = userList.filter(u => u.roles?.includes('ADMIN')).length;
      const totalJournals = userList.reduce((sum, u) => sum + (u.journalEntryList?.length || 0), 0);
      
      setStats({ totalUsers, totalAdmins, totalJournals });
    } catch (err) {
      setError('Failed to fetch users.');
    }
    setLoading(false);
  };

  // Fetch recent journals
  const fetchRecentJournals = useCallback(async () => {
    try {
      const allJournals = [];
      for (const user of users) {
        if (user.journalEntryList && user.journalEntryList.length > 0) {
          const userJournals = user.journalEntryList.map(journal => ({
            ...journal,
            username: user.username
          }));
          allJournals.push(...userJournals);
        }
      }
      
      // Sort by date (newest first) and take the most recent 10
      const sortedJournals = allJournals
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      
      setRecentJournals(sortedJournals);
    } catch (err) {
      console.error('Error fetching recent journals:', err);
    }
  }, [users]);

  const fetchWeeklyMoodStats = async () => {
    setMoodChartLoading(true);
    try {
      const response = await api.get('/admin/weekly-mood-stats');
      setWeeklyMoodData(response.data);
    } catch (err) {
      console.error('Error fetching weekly mood statistics:', err);
      setError('Failed to fetch weekly mood statistics.');
    }
    setMoodChartLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchRecentJournals();
      fetchWeeklyMoodStats();
    }
  }, [users, fetchRecentJournals]);

  // Handle viewing a journal
  const handleViewJournal = (journal) => {
    setSelectedJournal(journal);
  };

  // Auto-scroll functionality for single card carousel
  useEffect(() => {
    let interval;
    if (isAutoScrolling && recentJournals.length > 1) {
      interval = setInterval(() => {
        setSlideDirection('right');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % recentJournals.length);
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoScrolling, recentJournals.length]);

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentIndex(currentIndex === 0 ? recentJournals.length - 1 : currentIndex - 1);
  };
  const handleNext = () => {
    setSlideDirection('right');
    setCurrentIndex((currentIndex + 1) % recentJournals.length);
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  // Handle opening the change role dialog
  const handleOpenChangeRoleDialog = () => {
    // Reset form data and open dialog for manual input
    setSelectedUserForRole({ username: '' });
    setSelectedRoles(['USER']); // Pre-select USER role as it's mandatory
    setUserEmail('');
    setError(''); // Clear any previous errors
    setRoleChangeDialogOpen(true);
  };

  // Handle closing the change role dialog
  const handleCloseChangeRoleDialog = () => {
    setRoleChangeDialogOpen(false);
    setSelectedUserForRole({ username: '' });
    setSelectedRoles(['USER']);
    setUserEmail('');
    setError('');
  };

  // Confirm role change with consent
  const confirmRoleChange = async () => {
    setRoleChangeLoading(true);
    setError('');
    setConfirmRoleChangeDialogOpen(false);
    
    try {
      await api.put('/admin/change-role', {
        username: selectedUserForRole.username,
        roles: selectedRoles,
        email: userEmail
      });
      setSuccess(`User roles updated successfully for ${selectedUserForRole.username}!`);
      setRoleChangeDialogOpen(false);
      // Reset form
      setSelectedUserForRole({ username: '' });
      setSelectedRoles(['USER']);
      setUserEmail('');
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user roles.');
    }
    setRoleChangeLoading(false);
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.username}! Manage your application and users from here.
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

      {/* Alerts */}
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={<PeopleIcon />} color="#2065D1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Administrators" value={stats.totalAdmins} icon={<AdminPanelSettingsIcon />} color="#388E3C" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Journal Entries" value={stats.totalJournals} icon={<AssessmentIcon />} color="#7E57C2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Sessions" value={stats.totalUsers} icon={<SecurityIcon />} color="#FFC107" />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <QuickActionCard 
              title="Change User Role" 
              description="Modify user roles and permissions" 
              icon={<EditIcon />} 
              onClick={handleOpenChangeRoleDialog}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <QuickActionCard 
              title="User Management" 
              description="View and manage all users in detail" 
              icon={<GroupIcon />} 
              onClick={() => navigate('/admin/users')}
              color="success"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Weekly Mood Statistics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Weekly Mood Statistics
        </Typography>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4caf50 0%, #2196f3 50%, #ff9800 100%)',
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                User Sentiment Trends
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: '1rem' }} />
                Last 7 days sentiment analysis across all users
              </Typography>
            </Box>
          </Box>
          
          <WeeklyMoodChart data={weeklyMoodData} loading={moodChartLoading} />
        </Paper>
      </Box>

      {/* Recent Journals Single Card Carousel */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7e57c2 0%, #5e35b1 50%, #4527a0 100%)',
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
              Recent Journal Entries
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotesIcon sx={{ fontSize: '1rem' }} />
              Latest journal entries from all users
            </Typography>
          </Box>
          <Box display="flex" gap={2} sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={isAutoScrolling ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={toggleAutoScroll}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderColor: isAutoScrolling ? 'success.main' : 'warning.main',
                color: isAutoScrolling ? 'success.main' : 'warning.main',
                '&:hover': {
                  borderColor: isAutoScrolling ? 'success.dark' : 'warning.dark',
                  backgroundColor: isAutoScrolling ? 'rgba(76, 175, 80, 0.04)' : 'rgba(255, 152, 0, 0.04)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {isAutoScrolling ? 'Pause' : 'Play'} Auto-Scroll
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {/* Navigation Arrows */}
          <IconButton
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
              width: 48,
              height: 48,
              '@media (max-width: 768px)': {
                left: 10,
                width: 40,
                height: 40,
              }
            }}
            onClick={handlePrev}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <IconButton
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
              width: 48,
              height: 48,
              '@media (max-width: 768px)': {
                right: 10,
                width: 40,
                height: 40,
              }
            }}
            onClick={handleNext}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Single Card Display with Slide Animation */}
          <Box
            sx={{
              width: { xs: '95vw', sm: '380px', md: '500px', lg: '600px' },
              maxWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '280px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              key={currentIndex}
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                transition: 'transform 0.6s cubic-bezier(.77,0,.18,1)',
                transform: slideDirection === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
                animation: `${slideDirection === 'right' ? 'slideInRight' : 'slideInLeft'} 0.6s forwards`,
                '@keyframes slideInRight': {
                  from: { transform: 'translateX(100%)' },
                  to: { transform: 'translateX(0)' },
                },
                '@keyframes slideInLeft': {
                  from: { transform: 'translateX(-100%)' },
                  to: { transform: 'translateX(0)' },
                },
              }}
            >
              {loading ? (
                <CircularProgress size={40} />
              ) : recentJournals.length > 0 ? (
                <JournalCarouselCard 
                  journal={recentJournals[currentIndex]} 
                  onClick={() => handleViewJournal(recentJournals[currentIndex])} 
                />
              ) : (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  py={6}
                  sx={{ color: 'text.secondary' }}
                >
                  <NotesIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    No Journal Entries Yet
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    Users haven't created any journal entries yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Change User Role Dialog */}
      <Dialog 
        open={roleChangeDialogOpen} 
        onClose={handleCloseChangeRoleDialog}
        PaperProps={{ 
          component: 'form', 
          onSubmit: (e) => { 
            e.preventDefault(); 
            // Validate form before showing confirmation
            if (!selectedUserForRole?.username?.trim()) {
              setError('Username is required.');
              return;
            }
            if (!userEmail.trim()) {
              setError('Email is required.');
              return;
            }
            if (selectedRoles.length === 0) {
              setError('At least one role must be selected.');
              return;
            }
            // Check if user exists
            const userExists = users.find(u => u.username === selectedUserForRole.username.trim());
            if (!userExists) {
              setError('User not found. Please enter a valid username.');
              return;
            }
            setError(''); // Clear any previous errors
            setConfirmRoleChangeDialogOpen(true); 
          } 
        }}
      >
        <DialogTitle fontWeight="bold">Change User Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={selectedUserForRole?.username || ''}
            onChange={(e) => setSelectedUserForRole({ ...selectedUserForRole, username: e.target.value })}
            fullWidth
            margin="normal"
            required
            placeholder="Enter username to change role"
          />
          <TextField
            label="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            type="email"
            placeholder="Enter user's email"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Roles</InputLabel>
            <Select
              labelId="role-select-label"
              label="Roles"
              multiple
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small"
                      color={value === 'ADMIN' ? 'error' : 'primary'}
                    />
                  ))}
                </Box>
              )}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role} value={role} sx={{ py: 1.5 }}>
                  <Checkbox 
                    checked={selectedRoles.indexOf(role) > -1}
                    disabled={role === 'USER'}
                  />
                  <ListItemText 
                    primary={
                      <Typography variant="body2" component="span">
                        {role}
                      </Typography>
                    }
                    secondary={role === 'USER' ? 'Mandatory base role' : 'Grants administrative access'}
                  />
                  {role === 'USER' && (
                    <Chip 
                      label="Required" 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 2 }}
                    />
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseChangeRoleDialog}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={roleChangeLoading}>
            {roleChangeLoading ? <CircularProgress size={24} /> : 'Save and Notify'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Role Change */}
      <Dialog
        open={confirmRoleChangeDialogOpen}
        onClose={() => {
          setConfirmRoleChangeDialogOpen(false);
          setError('');
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="warning.main">
            Confirm Role Change
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You are about to change the roles for user: <strong>{selectedUserForRole?.username}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Email: <strong>{userEmail}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            New roles: <strong>{selectedRoles.join(', ')}</strong>
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> Changing user roles will affect their permissions and access to the system. 
              This action will be logged and cannot be undone immediately.
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to proceed with this role change?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setConfirmRoleChangeDialogOpen(false);
              setError('');
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmRoleChange} 
            disabled={roleChangeLoading}
            variant="contained"
            color="warning"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {roleChangeLoading ? <CircularProgress size={20} /> : 'Confirm and Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <JournalDetailModal
        journal={selectedJournal}
        open={!!selectedJournal}
        onClose={() => setSelectedJournal(null)}
      />
    </Box>
  );
}

export default AdminDashboard; 