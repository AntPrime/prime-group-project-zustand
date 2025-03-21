import axios from "axios";
import { useState, useEffect } from "react";
import SearchFetchEvents from "../SearchFetchEvents/SearchFetchEvents";
// Import MUI components
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function EventsPage() {
  const [event, setEvent] = useState({
    activities_id: "",
    title: "",
    date: "",
    time: "",
    school_id: "",
    location: "",
    channel: "",
    notes: ""
  });
  
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch all events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('/api/events/all')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  // Handle search results from SearchFetchEvents
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  //POST to create a new event 
  const createEvent = (e) => {
    e.preventDefault();
    
    // Make sure all required fields are present and properly formatted
    const eventToSend = {
      activities_id: Number(event.activities_id) || null,
      title: event.title || '',
      date: event.date || null,
      time: event.time || null,
      school_id: Number(event.school_id) || null,
      location: event.location || '',
      channel: event.channel || '',
      notes: event.notes || ''
    };
    
    console.log("sending event", eventToSend);
    
    axios
      .post("/api/events", eventToSend)
      .then((response) => {
        console.log("Event created successfully:", response.data);
        fetchEvents(); // Refresh the events list
        setEvent({ 
          activities_id: "", 
          date: "", 
          time: "",
          title: "", 
          school_id: "", 
          location: "", 
          channel: "", 
          notes: "" 
        });
      })
      .catch((err) => {
        console.log("error in event post", err);
        // Show more detailed error information
        if (err.response) {
          console.log("Error response data:", err.response.data);
        }
      });
  };

  // Delete an event
  const deleteEvent = (id) => {
    axios.delete(`/api/events/${id}`)
      .then(() => {
        fetchEvents(); // Refresh the events list
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };

  // Open edit dialog
  const openEditDialog = (eventToEdit) => {
    setEditingEvent({...eventToEdit});
    setOpenDialog(true);
  };

  // Update an event
  const updateEvent = () => {
    if (!editingEvent || !editingEvent.id) {
      console.error('Cannot update event: Missing event ID');
      return;
    }
    
    axios.put(`/api/events/${editingEvent.id}`, editingEvent)
      .then(() => {
        fetchEvents(); // Refresh the events list
        setOpenDialog(false);
      })
      .catch(error => {
        console.error('Error updating event:', error);
      });
  };

  // Get activity name from ID
  const getActivityName = (id) => {
    const activities = {
      1: "Basketball",
      2: "Tennis",
      3: "Football",
      4: "Lacrosse",
      5: "Hockey"
    };
    return activities[id] || "Unknown";
  };

  // Get school name from ID
  const getSchoolName = (id) => {
    const schools = {
      1: "Albert Lea",
      2: "Faibault",
      3: "Northfield"
    };
    return schools[id] || "Unknown";
  };

  return (
    <div className="EventsPage">
      <Typography variant="h4" gutterBottom>Events</Typography>
      
      <SearchFetchEvents onSearchResults={handleSearchResults} />
      
      {/* Display search results if available */}
      {searchResults.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Search Results</Typography>
          <Grid container spacing={3}>
            {searchResults.map((result) => (
              <Grid item xs={12} sm={6} md={4} key={result["events id"]}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{result.title}</Typography>
                    <Typography variant="body1">Activity: {result.activity}</Typography>
                    <Typography variant="body2">
                      Date: {new Date(result.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Time: {result.time}
                    </Typography>
                    <Typography variant="body2">
                      School: {result["school name"]}
                    </Typography>
                    <Typography variant="body2">
                      Location: {result.location}
                    </Typography>
                    <Typography variant="body2">
                      Channel: {result.channel}
                    </Typography>
                    <Typography variant="body2">
                      Notes: {result.notes}
                    </Typography>
                    {result["play-by-play"] && (
                      <Typography variant="body2">
                        Play-by-play: {result["play-by-play"]}
                      </Typography>
                    )}
                    {result["color comm."] && (
                      <Typography variant="body2">
                        Color Commentator: {result["color comm."]}
                      </Typography>
                    )}
                    {result.camera && (
                      <Typography variant="body2">
                        Camera: {result.camera}
                      </Typography>
                    )}
                    {result.producer && (
                      <Typography variant="body2">
                        Producer: {result.producer}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button 
                        startIcon={<EditIcon />} 
                        variant="outlined" 
                        onClick={() => openEditDialog({
                          id: result["events id"],
                          activities_id: result.activity,
                          title: result.title,
                          date: result.date,
                          time: result.time,
                          school_id: result["school name"],
                          location: result.location,
                          channel: result.channel,
                          notes: result.notes
                        })}
                      >
                        Edit
                      </Button>
                      <Button 
                        startIcon={<DeleteIcon />} 
                        variant="outlined" 
                        color="error"
                        onClick={() => deleteEvent(result["events id"])}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 4 }} />
        </Box>
      )}
      
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Event</Typography>
        <form onSubmit={createEvent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Activity</InputLabel>
                <Select
                  value={event.activities_id}
                  label="Activity"
                  onChange={(e) => setEvent({ ...event, activities_id: e.target.value })}
                >
                  <MenuItem value="">Select Activity</MenuItem>
                  <MenuItem value="1">Basketball</MenuItem>
                  <MenuItem value="2">Tennis</MenuItem>
                  <MenuItem value="3">Football</MenuItem>
                  <MenuItem value="4">Lacrosse</MenuItem>
                  <MenuItem value="5">Hockey</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Title"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={event.time}
                onChange={(e) => setEvent({ ...event, time: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>School</InputLabel>
                <Select
                  value={event.school_id}
                  label="School"
                  onChange={(e) => setEvent({ ...event, school_id: e.target.value })}
                >
                  <MenuItem value="">Select School</MenuItem>
                  <MenuItem value="1">Albert Lea</MenuItem>
                  <MenuItem value="2">Faibault</MenuItem>
                  <MenuItem value="3">Northfield</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={event.channel}
                  label="Channel"
                  onChange={(e) => setEvent({ ...event, channel: e.target.value })}
                >
                  <MenuItem value="">Select Channel</MenuItem>
                  <MenuItem value="Albert Lea Live">Albert Lea Live</MenuItem>
                  <MenuItem value="Fairbault Live">Fairbault Live</MenuItem>
                  <MenuItem value="Northfield Live">Northfield Live</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Notes"
                value={event.notes}
                onChange={(e) => setEvent({ ...event, notes: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Add Event
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      
      <Typography variant="h5" gutterBottom>All Events</Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body1">Activity: {getActivityName(event.activities_id)}</Typography>
                <Typography variant="body2">
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Time: {event.time}
                </Typography>
                <Typography variant="body2">
                  School: {getSchoolName(event.school_id)}
                </Typography>
                <Typography variant="body2">
                  Location: {event.location}
                </Typography>
                <Typography variant="body2">
                  Channel: {event.channel}
                </Typography>
                <Typography variant="body2">
                  Notes: {event.notes}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    startIcon={<EditIcon />} 
                    variant="outlined" 
                    onClick={() => openEditDialog(event)}
                  >
                    Edit
                  </Button>
                  <Button 
                    startIcon={<DeleteIcon />} 
                    variant="outlined" 
                    color="error"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Activity</InputLabel>
                <Select
                  value={editingEvent?.activities_id || ""}
                  label="Activity"
                  onChange={(e) => setEditingEvent({ ...editingEvent, activities_id: e.target.value })}
                >
                  <MenuItem value="">Select Activity</MenuItem>
                  <MenuItem value="1">Basketball</MenuItem>
                  <MenuItem value="2">Tennis</MenuItem>
                  <MenuItem value="3">Football</MenuItem>
                  <MenuItem value="4">Lacrosse</MenuItem>
                  <MenuItem value="5">Hockey</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={editingEvent?.title || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editingEvent?.date ? editingEvent.date.substring(0, 10) : ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={editingEvent?.time || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>School</InputLabel>
                <Select
                  value={editingEvent?.school_id || ""}
                  label="School"
                  onChange={(e) => setEditingEvent({ ...editingEvent, school_id: e.target.value })}
                >
                  <MenuItem value="">Select School</MenuItem>
                  <MenuItem value="1">Albert Lea</MenuItem>
                  <MenuItem value="2">Faibault</MenuItem>
                  <MenuItem value="3">Northfield</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={editingEvent?.location || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={editingEvent?.channel || ""}
                  label="Channel"
                  onChange={(e) => setEditingEvent({ ...editingEvent, channel: e.target.value })}
                >
                  <MenuItem value="">Select Channel</MenuItem>
                  <MenuItem value="Albert Lea Live">Albert Lea Live</MenuItem>
                  <MenuItem value="Fairbault Live">Fairbault Live</MenuItem>
                  <MenuItem value="Northfield Live">Northfield Live</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notes"
                value={editingEvent?.notes || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={updateEvent} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventsPage;
