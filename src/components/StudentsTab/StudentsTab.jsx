
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

function StudentsTab() {
  // State for users and their event roles
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  
  // State for filtering
  const [filters, setFilters] = useState({
    username: '',
    event: '',
    date: '',
    role: ''
  });
  
  // State for editing
  const [editOpen, setEditOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editForm, setEditForm] = useState({
    event: '',
    role: ''
  });
  
  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch users and events on component mount
  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  // Process user events when users and events data changes
  useEffect(() => {
    if (users.length > 0 && events.length > 0) {
      processUserEvents();
    }
  }, [users, events]);

  // Fetch all users from the database
  const fetchUsers = () => {
    axios.get("/api/user/all")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error("GET /api/user/all error:", err);
        showSnackbar('Failed to fetch users: ' + (err.response?.data?.error || err.message), 'error');
      });
  };

  // Fetch all events from the database
  const fetchEvents = () => {
    axios.get("/api/events/all")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((err) => {
        console.error("GET /api/events/all error:", err);
        showSnackbar('Failed to fetch events: ' + (err.response?.data?.error || err.message), 'error');
      });
  };

  // Process user events to create a combined list of users and their event roles
  const processUserEvents = () => {
    // Create a map of user events
    const userEventMap = {};
    
    // Initialize with all users (including those without events)
    users.forEach(user => {
      userEventMap[user.id] = {
        userId: user.id,
        username: user.username,
        events: []
      };
    });
    
    // Add event roles for each user
    events.forEach(event => {
      // Play-by-Play role
      if (event.play_by_play) {
        if (userEventMap[event.play_by_play]) {
          userEventMap[event.play_by_play].events.push({
            eventId: event.id,
            eventTitle: event.title,
            role: 'Play-by-Play',
            date: event.date
          });
        }
      }
      
      // Color Commentator role
      if (event.color_commentator) {
        if (userEventMap[event.color_commentator]) {
          userEventMap[event.color_commentator].events.push({
            eventId: event.id,
            eventTitle: event.title,
            role: 'Color Commentator',
            date: event.date
          });
        }
      }
      
      // Camera role
      if (event.camera) {
        if (userEventMap[event.camera]) {
          userEventMap[event.camera].events.push({
            eventId: event.id,
            eventTitle: event.title,
            role: 'Camera',
            date: event.date
          });
        }
      }
      
      // Producer role
      if (event.producer) {
        if (userEventMap[event.producer]) {
          userEventMap[event.producer].events.push({
            eventId: event.id,
            eventTitle: event.title,
            role: 'Producer',
            date: event.date
          });
        }
      }
    });
    
    // Convert map to array and sort by latest event date
    const userEventsArray = Object.values(userEventMap).map(user => ({
      ...user,
      events: user.events.sort((a, b) => new Date(b.date) - new Date(a.date))
    }));
    
    setUserEvents(userEventsArray);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter user events based on current filters
  const getFilteredUserEvents = () => {
    return userEvents.filter(user => {
      // Filter by username
      if (filters.username && !user.username.toLowerCase().includes(filters.username.toLowerCase())) {
        return false;
      }
      
      // Filter by event
      if (filters.event) {
        const hasMatchingEvent = user.events.some(event => 
          event.eventTitle.toLowerCase().includes(filters.event.toLowerCase())
        );
        if (!hasMatchingEvent) return false;
      }
      
      // Filter by role
      if (filters.role) {
        const hasMatchingRole = user.events.some(event => 
          event.role.toLowerCase().includes(filters.role.toLowerCase())
        );
        if (!hasMatchingRole) return false;
      }
      
      // Filter by date
      if (filters.date) {
        const hasMatchingDate = user.events.some(event => 
          event.date.includes(filters.date)
        );
        if (!hasMatchingDate) return false;
      }
      
      return true;
    });
  };

  // Handle opening the edit dialog
  const handleEditClick = (userEvent) => {
    setCurrentEditItem(userEvent);
    setEditForm({
      event: userEvent.events[0]?.eventTitle || '',
      role: userEvent.events[0]?.role || ''
    });
    setEditOpen(true);
  };

  // Handle closing the edit dialog
  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentEditItem(null);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle saving the edited user event
  const handleSaveEdit = () => {
    // Get original assignment details
    const originalEvent = currentEditItem.events[0];
    const originalEventId = originalEvent.eventId;
    const originalRole = originalEvent.role;
  
    // Get new assignment details
    const newEvent = events.find(e => e.title === editForm.event);
    const newRole = editForm.role;
  
    if (!newEvent) {
      showSnackbar('Event not found', 'error');
      return;
    }
  
    // Make API call to reassign
    axios.put('/api/assignRole/reassign-role', {
      originalEventId,
      originalRole,
      newEventId: newEvent.id,
      newRole,
      userId: currentEditItem.userId
    })
    .then(() => {
      // Refresh both events and users
      Promise.all([fetchEvents(), fetchUsers()])
        .then(() => {
          showSnackbar('Role reassigned successfully');
          handleEditClose();
        });
    })
    .catch(err => {
      console.error('Error reassigning role:', err);
      showSnackbar('Failed to reassign role: ' + (err.response?.data?.error || err.message), 'error');
    });
  };
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      username: '',
      event: '',
      date: '',
      role: ''
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <Typography variant="h4" gutterBottom sx={{ 
      color: '#2c3e50',
      fontWeight: '600',
      mb: 4,
      borderBottom: '2px solid #3498db',
      pb: 1
    }}>
      Event Role Management
    </Typography>

    {/* Filter Controls */}
    <Paper sx={{ 
      p: 3, 
      mb: 3,
      borderRadius: '12px',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }}>
      <Grid container spacing={2} alignItems="center">
        {['username', 'event', 'date', 'role'].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field}>
            <TextField
              fullWidth
              variant="outlined"
              label={`Filter by ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              value={filters[field]}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }
              }}
            />
          </Grid>
        ))}
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button 
            variant="contained" 
            onClick={handleClearFilters}
            sx={{
              bgcolor: '#3498db',
              '&:hover': { bgcolor: '#2980b9' },
              textTransform: 'none',
              borderRadius: '8px',
              px: 4,
              py: 1
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>

    {/* Users and Events List */}
    <Paper sx={{ 
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#3498db' }}>
            <TableRow>
              {['Username', 'Event', 'Role', 'Date', 'Actions'].map((header) => (
                <TableCell 
                  key={header}
                  sx={{ 
                    color: 'white', 
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredUserEvents().map((user) => (
              user.events.length > 0 ? (
                user.events.map((event, index) => (
                  <TableRow 
                    key={`${user.userId}-${event.eventId}-${index}`}
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { bgcolor: '#f8f9fa' },
                      '&:last-child td': { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ fontWeight: '500' }}> <strong>{user.username}</strong></TableCell>
                    <TableCell>{event.eventTitle}</TableCell>
                    <TableCell>
                      <Chip 
                        label={event.role}
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          borderRadius: '4px',
                          borderWidth: '2px',
                          fontWeight: '500'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleEditClick({...user, events: [event]})}
                        sx={{ color: '#3498db' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key={user.userId}>
                  <TableCell colSpan={5} sx={{ 
                    bgcolor: '#fff3cd',
                    color: '#856404',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    <strong>{user.username}</strong> - No assigned events
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    {/* Edit Dialog */}
    <Dialog 
      open={editOpen} 
      onClose={handleEditClose}
      PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}
    >
      <DialogTitle sx={{ 
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#2c3e50',
        pb: 1
      }}>
        Reassign User Role
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#7f8c8d' }}>
            User: <span style={{ color: '#2c3e50' }}>{currentEditItem?.username}</span>
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Event</InputLabel>
          <Select
            value={editForm.event}
            onChange={(e) => setEditForm({ ...editForm, event: e.target.value })}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          >
            {events.map((event) => (
              <MenuItem key={event.id} value={event.title}>
                {event.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
          >
            {['Play-by-Play', 'Color Commentator', 'Camera', 'Producer'].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ pt: 2 }}>
        <Button 
          onClick={handleEditClose}
          sx={{ 
            color: '#7f8c8d',
            '&:hover': { backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveEdit}
          variant="contained"
          sx={{
            bgcolor: '#3498db',
            '&:hover': { bgcolor: '#2980b9' },
            borderRadius: '8px',
            px: 4,
            textTransform: 'none'
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>

    {/* Snackbar */}
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        severity={snackbar.severity}
        sx={{ 
          width: '100%',
          borderRadius: '8px',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
);
}

export default StudentsTab; 