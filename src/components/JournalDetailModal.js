import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import {
  CalendarMonth,
  Notes as NotesIcon,
  Face as FaceIcon
} from '@mui/icons-material';
import { getSentimentStyle } from '../utils/sentimentUtils';

const JournalDetailModal = ({ journal, open, onClose }) => {
  if (!journal) return null;

  const sentimentStyle = getSentimentStyle(journal.sentiment);
  const formattedDate = new Date(journal.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '2rem', p: 3, background: '#f4f6f8' }}>
        {journal.title}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarMonth color="action" />
              <Box ml={2}>
                <Typography variant="subtitle1" fontWeight="bold">Date</Typography>
                <Typography variant="body1" color="text.secondary">{formattedDate}</Typography>
              </Box>
            </Box>
          </Grid>
          {journal.sentiment && (
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <FaceIcon color="action" />
                <Box ml={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Sentiment</Typography>
                  <Chip 
                    label={sentimentStyle.label} 
                    color={sentimentStyle.color} 
                    size="small" 
                    icon={sentimentStyle.icon}
                  />
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3 }} />

        <Box display="flex" alignItems="flex-start">
          <NotesIcon color="action" sx={{ mt: 0.5 }}/>
          <Box ml={2} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Content
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {journal.content}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, background: '#f4f6f8' }}>
        <Button onClick={onClose} variant="text" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JournalDetailModal; 