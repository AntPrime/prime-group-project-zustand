
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
  DialogContentText
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Students and Event Roles
      </Typography>
      
      {/* Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Filter by Username"
              value={filters.username}
              onChange={(e) => handleFilterChange('username', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Filter by Event"
              value={filters.event}
              onChange={(e) => handleFilterChange('event', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Filter by Date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Filter by Role"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Users and Events Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredUserEvents().map((user) => (
              user.events.length > 0 ? (
                // User has events
                user.events.map((event, index) => (
                  <TableRow key={`${user.userId}-${event.eventId}-${index}`}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{event.eventTitle}</TableCell>
                    <TableCell>{event.role}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick({...user, events: [event]})}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // User has no events
                <TableRow key={user.userId}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell colSpan={4}>No events assigned</TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
      <DialogTitle>Reassign User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Reassign {currentEditItem?.username} to a new event/role
          </DialogContentText>
          <TextField
            select
            autoFocus
            margin="dense"
            label="Event"
            fullWidth
            value={editForm.event}
            onChange={(e) => setEditForm({ ...editForm, event: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.title}>
                {event.title}
              </option>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select a role</option>
            <option value="Play-by-Play">Play-by-Play</option>
            <option value="Color Commentator">Color Commentator</option>
            <option value="Camera">Camera</option>
            <option value="Producer">Producer</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StudentsTab; 