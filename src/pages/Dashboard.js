import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Chip,
  Paper
} from '@mui/material';
import {
  Book as JournalIcon,
  Person as ProfileIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Event as EventIcon,
  DateRange as DateRangeIcon,
  Insights as InsightsIcon,
  Lightbulb as LightbulbIcon,
  FormatQuote as QuoteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

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

const DailyQuoteCard = ({ quote, author, loading }) => (
  <Card sx={{
    borderRadius: 4,
    background: 'linear-gradient(135deg, #a8c0ff 0%, #b8a9c9 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      opacity: 0.1
    }
  }}>
    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      <Box display="flex" justifyContent="center" alignItems="flex-start" mb={1.5}>
        <QuoteIcon sx={{ fontSize: 32, opacity: 0.8 }} />
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={3}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : (
        <>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.4,
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            "{quote}"
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Chip 
              label={`— ${author}`} 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': { px: 2 }
              }} 
            />
          </Box>
        </>
      )}
    </CardContent>
  </Card>
);

const JournalingTips = () => {
    const tips = [
        { title: 'Start Small', description: 'Even a few sentences each day can make a big difference.', color: 'primary.main' },
        { title: 'Be Honest', description: 'Your journal is a safe space. Write authentically without judgment.', color: 'secondary.main' },
        { title: 'Track Progress', description: 'Use sentiment analysis to understand your emotional patterns over time.', color: 'success.main' }
    ];

    return (
        <Box sx={{mt: 4}}>
             <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Journaling Tips <LightbulbIcon sx={{verticalAlign: 'middle', color: 'warning.main'}}/>
            </Typography>
            <Grid container spacing={3}>
                {tips.map(tip => (
                    <Grid item xs={12} md={4} key={tip.title}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" color={tip.color} gutterBottom>
                                {tip.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {tip.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEntries: 0,
    thisWeek: 0,
    thisMonth: 0,
    avgPerWeek: '0.0',
  });
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    fetchUserStats();
    fetchDailyQuote();
  }, []);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/journal');
      const entries = res.data || [];
      
      if (entries.length === 0) {
        setStats({ totalEntries: 0, thisWeek: 0, thisMonth: 0, avgPerWeek: '0.0' });
        setLoading(false);
        return;
      }

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = entries.filter(entry => new Date(entry.date) >= oneWeekAgo).length;
      const thisMonth = entries.filter(entry => new Date(entry.date) >= oneMonthAgo).length;
      
      const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstEntryDate = new Date(sortedEntries[0].date);
      const weeksActive = (now.getTime() - firstEntryDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
      const avgPerWeek = weeksActive > 1 ? (entries.length / weeksActive).toFixed(1) : entries.length.toFixed(1);

      setStats({
        totalEntries: entries.length,
        thisWeek,
        thisMonth,
        avgPerWeek,
      });
    } catch (err) {
      setError('Failed to fetch journal statistics.');
      console.error(err);
    }
    setLoading(false);
  };

  const fetchDailyQuote = async () => {
    setQuoteLoading(true);
    try {
      const res = await api.get('/user/daily-quote');
      setQuote(res.data);
    } catch (err) {
      console.error('Failed to fetch daily quote:', err);
      setQuote({ 
        quote: "The only way to do great work is to love what you do.", 
        author: "Steve Jobs" 
      });
    }
    setQuoteLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, background: '#f4f6f8' }}>
       <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.username}!
        </Typography>
      </Box>

      {/* Daily Quote Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Quote of the day
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DailyQuoteCard 
              quote={quote.quote} 
              author={quote.author} 
              loading={quoteLoading}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Entries" value={stats.totalEntries} icon={<AssessmentIcon />} color="#2065D1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="This Week" value={stats.thisWeek} icon={<DateRangeIcon />} color="#388E3C" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="This Month" value={stats.thisMonth} icon={<EventIcon />} color="#FFC107" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Avg. Per Week" value={stats.avgPerWeek} icon={<InsightsIcon />} color="#7E57C2" />
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <QuickActionCard 
                    title="New Journal Entry" 
                    description="Capture your thoughts and feelings" 
                    icon={<AddIcon />} 
                    onClick={() => navigate('/journal')}
                    color="primary"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <QuickActionCard 
                    title="View Journal" 
                    description="Browse your past entries" 
                    icon={<JournalIcon />} 
                    onClick={() => navigate('/journal')}
                    color="success"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <QuickActionCard 
                    title="Profile Settings" 
                    description="Update your preferences" 
                    icon={<ProfileIcon />} 
                    onClick={() => navigate('/profile')}
                    color="warning"
                />
            </Grid>
        </Grid>
      </Box>

      <JournalingTips />

    </Box>
  );
}

export default Dashboard; 