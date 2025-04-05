import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { Box, Container, TextField, Select, MenuItem, Button, Typography, Grid } from "@mui/material";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";
import CreateNewActivity from "../CreateNewActivity/CreateNewActivity";  // Import the new component

function EventsPage() {
  const [newEvent, setNewEvent] = useState({
    activities_id: 0,
    title: "",
    date: "",
    time: "",
    school_id: 0,
    location: "",
    channel: "",
    notes: ""
  });

  const fetchEvents = useStore((state) => state.fetchEvents);
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [activities, setActivities] = useState([]); // Store activities

  useEffect(() => {
    fetchEvents();
    // Fetch all schools when the component mounts
    axios.get('/api/createSchool/schools')
      .then((res) => {
        console.log('Schools fetched:', res.data);  // Debugging the fetched schools data
        setSchools(res.data);  // Update the list of schools in the state
      })
      .catch((err) => {
        console.error('Error fetching schools:', err.response || err.message);
        alert('Error fetching schools');
      });
    
    // Fetch activities when the component mounts
    axios.get('/api/createActivity/activities')  // Ensure this matches the updated GET route for fetching activities
      .then((res) => {
        console.log('Activities fetched:', res.data);  // Debugging the fetched activities data
        setActivities(res.data);  // Update the list of activities in the state
      })
      .catch((err) => {
        console.error('Error fetching activities:', err.response || err.message);
        alert('Error fetching activities');
      });
  }, [fetchEvents]);

  //POST to create a new event 
  const createEvent = () => {
    console.log('in createEvent');
    console.log('newEvent:', newEvent);
    axios.post('/api/events', newEvent).then(function (response) {
      console.log(response.data);
      fetchEvents();
      navigate("/studentHomePage"); // navigate to studentHomePage can be changed to the adminPage
    }).catch(function (err) {
      console.log(err);
      alert('Error creating new event');
    });
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add an Event
      </Typography>

      {/* Event Title Field */}
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        sx={{ marginBottom: 2 }}
      />

<Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
  <TextField
    fullWidth
    type="date"
    label="Date"
    InputLabelProps={{ shrink: true }}
    value={newEvent.date}
    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
    sx={{ flex: 2 }}
  />
  <TextField
    fullWidth
    type="time"
    label="Start Time"
    InputLabelProps={{ shrink: true }}
    value={newEvent.time}
    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
    sx={{ flex: 2 }}
  />
</Box>

      {/* Location Field */}
      <TextField
        fullWidth
        label="Location"
        variant="outlined"
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        sx={{ marginBottom: 2 }}
      />

      {/* School Selector */}
      <Box sx={{ marginBottom: 2 }}>
        <CreateNewSchool setSchools={setSchools} schools={schools} />
      </Box>

      {/* Activity Selector */}
      <Box sx={{ marginBottom: 2 }}>
        <CreateNewActivity setActivities={setActivities} activities={activities} /> {/* Add CreateNewActivity component */}
      </Box>

      {/* Channel Selection */}
      <Select
        fullWidth
        value={newEvent.channel}
        onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value })}
        displayEmpty
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="">Select Channel</MenuItem>
        <MenuItem value="Albert Lea Live">Albert Lea Live</MenuItem>
        <MenuItem value="Fairbault Live">Fairbault Live</MenuItem>
        <MenuItem value="Northfield Live">Northfield Live</MenuItem>
      </Select>

      {/* Notes Field */}
      <TextField
        fullWidth
        label="Notes"
        variant="outlined"
        multiline
        rows={4}
        value={newEvent.notes}
        onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
        sx={{ marginBottom: 3 }}
        InputProps={{
          style: {
            resize: 'both', // Enables resizing
            overflow: 'auto', // Prevents overflow when resizing
          },
        }}
      />

      {/* Add Event Button */}
      <Button variant="contained" color="primary" fullWidth onClick={createEvent}>
        Add Event
      </Button>
    </Container>
  );
}

export default EventsPage;

