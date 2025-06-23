import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Grid, Chip, Alert, CircularProgress, Card,
  CardContent, CardActions, Menu, MenuItem, Paper, ListItemIcon,
  Divider, Avatar
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  MoreVert as MoreVertIcon, Close as CloseIcon, 
  Book as BookIcon,
} from '@mui/icons-material';
import api from '../api/axios';
import JournalDetailModal from '../components/JournalDetailModal';
import { getSentimentChip } from '../utils/sentimentUtils';

const JournalCard = ({ entry, onEdit, onDelete, onView }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleDelete = () => {
        onDelete(entry.id);
        handleMenuClose();
    };

    const handleEdit = () => {
        onEdit(entry);
        handleMenuClose();
    }
    
    const day = new Date(entry.date).getDate();
    const month = new Date(entry.date).toLocaleString('default', { month: 'short' }).toUpperCase();

    return (
        <Card sx={{
            position: 'relative',
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 4, 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden', // to contain the pseudo-element
            '&:hover': { 
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)', 
                transform: 'translateY(-6px)',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
            }
        }}>
            <CardContent sx={{ 
                flexGrow: 1, 
                cursor: 'pointer',
                p: 3,
                display: 'flex',
                gap: 2.5,
                alignItems: 'flex-start',
                '&:last-child': { pb: 3 }
            }} onClick={() => onView(entry)}>
                {/* Date Block */}
                <Box sx={{ textAlign: 'center', flexShrink: 0, pt: 0.5 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: 'primary.main', lineHeight: 1 }}>
                        {day}
                    </Typography>
                    <Typography variant="button" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {month}
                    </Typography>
                </Box>
                
                {/* Content Block */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        sx={{
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                            mb: 1
                        }}
                    >
                        {entry.title}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box', 
                            WebkitLineClamp: 3, 
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            minHeight: 60, // approx 3 lines
                            lineHeight: 1.6,
                        }}
                    >
                        {entry.content}
                    </Typography>
                </Box>
            </CardContent>
            
            <Divider sx={{ mx: 3 }} />

            <CardActions sx={{ 
                justifyContent: 'space-between', 
                p: 1.5,
                px: 3,
            }}>
                {(() => {
                    const sentimentChip = getSentimentChip(entry.sentiment);
                    return (
                        <Chip 
                            icon={sentimentChip.icon}
                            label={sentimentChip.label}
                            color={sentimentChip.color} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontWeight: 500 }} 
                        />
                    );
                })()}
                <IconButton 
                    size="small" 
                    onClick={handleMenuClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu 
                    anchorEl={anchorEl} 
                    open={open} 
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <MenuItem onClick={handleEdit} sx={{ py: 1, px: 2 }}>
                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                        Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ py: 1, px: 2, color: 'error.main' }}>
                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                        Delete
                    </MenuItem>
                </Menu>
            </CardActions>
        </Card>
    );
};

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, isSaving }) => (
    <Dialog 
        open={open} 
        onClose={onClose}
        PaperProps={{
            sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)'
            }
        }}
    >
        <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
            <Typography color="text.secondary">{message}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={onClose} disabled={isSaving} variant="outlined">
                Cancel
            </Button>
            <Button onClick={onConfirm} color="error" variant="contained" disabled={isSaving}>
                {isSaving ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
        </DialogActions>
    </Dialog>
);

function Journal() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    
    const [currentEntry, setCurrentEntry] = useState(null);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [viewedEntry, setViewedEntry] = useState(null);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/journal');
            const sortedEntries = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
            setEntries(sortedEntries);
        } catch (err) {
            setError('Failed to fetch journal entries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleOpenCreate = () => {
        setCurrentEntry(null);
        setTitle('');
        setContent('');
        setFieldErrors({});
        setOpenFormDialog(true);
    };

    const handleOpenEdit = (entry) => {
        setCurrentEntry(entry);
        setTitle(entry.title);
        setContent(entry.content);
        setFieldErrors({});
        setOpenFormDialog(true);
    };

    const handleOpenView = (entry) => {
        setViewedEntry(entry);
    };

    const handleOpenDelete = (id) => {
        setEntryToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!entryToDelete) return;
        setSaving(true);
        try {
            await api.delete(`/journal/id/${entryToDelete}`);
            setSuccess('Entry deleted successfully.');
            fetchEntries(); 
        } catch (err) {
            setError('Failed to delete entry.');
        } finally {
            setOpenDeleteDialog(false);
            setEntryToDelete(null);
            setSaving(false);
        }
    };

    const handleSave = async () => {
        setFieldErrors({});
        setError('');

        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required.';
        if (!content.trim()) newErrors.content = 'Content is required.';

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        setSaving(true);
        try {
            const payload = { title, content };
            if (currentEntry) {
                await api.put(`/journal/id/${currentEntry.id}`, payload);
                setSuccess('Entry updated successfully.');
            } else {
                await api.post('/journal', payload);
                setSuccess('Entry created successfully.');
            }
            setOpenFormDialog(false);
            setCurrentEntry(null);
            setTitle('');
            setContent('');
            fetchEntries();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save entry.');
        } finally {
            setSaving(false);
        }
    };
    
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (loading && entries.length === 0) {
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
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        My Journal
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Capture your thoughts, feelings, and memories
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={handleOpenCreate}
                    sx={{ 
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    New Entry
                </Button>
            </Box>

            {success && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 3, borderRadius: 2 }} 
                    onClose={() => setSuccess('')}
                >
                    {success}
                </Alert>
            )}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }} 
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}

            {entries.length === 0 && !loading ? (
                <Paper sx={{
                    p: 6, 
                    textAlign: 'center', 
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                    mt: 4,
                    border: '1px solid rgba(0,0,0,0.04)'
                }}>
                    <Avatar sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: 'primary.main', 
                        mb: 3,
                        mx: 'auto'
                    }}>
                        <BookIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Your Journal Awaits
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        Ready to capture your thoughts, feelings, and memories? 
                        Start your journaling journey with your first entry.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={handleOpenCreate}
                        sx={{ 
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Create First Entry
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {entries.map(entry => (
                        <Grid item xs={12} sm={6} md={4} key={entry.id}>
                            <JournalCard 
                                entry={entry} 
                                onView={handleOpenView}
                                onEdit={handleOpenEdit}
                                onDelete={handleOpenDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create/Edit Dialog */}
            <Dialog 
                open={openFormDialog} 
                onClose={() => !saving && setOpenFormDialog(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {currentEntry ? 'Edit Entry' : 'New Entry'}
                    </Typography>
                </DialogTitle>
                <IconButton 
                    onClick={() => !saving && setOpenFormDialog(false)} 
                    sx={{
                        position: 'absolute', 
                        right: 16, 
                        top: 16,
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={saving}
                        error={!!fieldErrors.title}
                        helperText={fieldErrors.title}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="content"
                        label="What's on your mind?"
                        type="text"
                        fullWidth
                        multiline
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                        disabled={saving}
                        error={!!fieldErrors.content}
                        helperText={fieldErrors.content}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={() => setOpenFormDialog(false)} 
                        disabled={saving}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        disabled={saving}
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        {saving ? <CircularProgress size={20} /> : 'Save Entry'}
                    </Button>
                </DialogActions>
            </Dialog>

            <JournalDetailModal 
                journal={viewedEntry}
                open={!!viewedEntry}
                onClose={() => setViewedEntry(null)}
            />

            <ConfirmationDialog 
                open={openDeleteDialog}
                onClose={() => !saving && setOpenDeleteDialog(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Journal Entry?"
                message="Are you sure you want to delete this entry? This action cannot be undone."
                isSaving={saving}
            />
        </Box>
    );
}

export default Journal;