import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { Box, Container, TextField, Select, MenuItem, Button, Typography, Grid } from "@mui/material";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";

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
  const fetchEvents = useStore((state) => state.fetchEvents)
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [isAddingSchool, setIsAddingSchool] = useState(true);
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  

useEffect(()=> {
  fetchEvents();
  // Fetch all schools when the component mounts
  axios.get('/api/createSchool/schools')  // Ensure this matches the updated GET route for fetching schools
  .then((res) => {
    console.log('Schools fetched:', res.data);  // Debugging the fetched schools data
    setSchools(res.data);  // Update the list of schools in the state
  })
  .catch((err) => {
    console.error('Error fetching schools:', err.response || err.message);
    alert('Error fetching schools');
  });
}, [fetchEvents] );

  //POST to create a new event 
  const createEvent = () => {
    console.log( 'in createEvent' );
    console.log('newEvent:', newEvent);
    axios.post( '/api/events', newEvent).then(function (response){
        console.log( response.data );
        fetchEvents();
        navigate("/studentHomePage"); // navigate to studentHomePage can be changed to the adminPage
      }).catch(function ( err ){
        console.log( err );
        alert( 'error creating new event' );
      });  
  };

  const handleSchoolModeChange = () => { setIsAddingSchool((prev) => !prev);};

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

    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      {/* Date Field */}
      <Grid item xs={4}>
        <TextField
          fullWidth
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
      </Grid>

      {/* Start Time Field */}
      <Grid item xs={4}>
        <TextField
          fullWidth
          type="time"
          label="Start Time"
          InputLabelProps={{ shrink: true }}
          value={newEvent.time}
          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
        />
      </Grid>
    </Grid>


{/* School Selection */}
      <Select
        fullWidth
        value={newEvent.school_id}
        onChange={(e) => setNewEvent({ ...newEvent, school_id: Number(e.target.value) })}
        displayEmpty
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value={0}>Select School</MenuItem>
        {schools.length > 0 ? (
          schools.map((school) => (
            <MenuItem key={school.id} value={school.id}>
              {school.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem value={0}>No Schools Available</MenuItem>
        )}
      </Select>

    {/* Location Field */}
    <TextField
      fullWidth
      label="Location"
      variant="outlined"
      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
      sx={{ marginBottom: 2 }}
    />

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

    {/* Activity Selection */}
    <Select
      fullWidth
      value={newEvent.activities_id}
      onChange={(e) => setNewEvent({ ...newEvent, activities_id: Number(e.target.value) })}
      displayEmpty
      sx={{ marginBottom: 2 }}
    >
      <MenuItem value={0}>Select Activity</MenuItem>
      <MenuItem value={1}>Basketball</MenuItem>
      <MenuItem value={2}>Tennis</MenuItem>
      <MenuItem value={3}>Football</MenuItem>
      <MenuItem value={4}>Lacrosse</MenuItem>
      <MenuItem value={5}>Hockey</MenuItem>
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
    
    {/* Add New School */}
    <Box sx={{ marginTop: 4 }}>
      <CreateNewSchool setSchools={setSchools} schools={schools} />
    </Box>
  </Container>
  
);
}

export default EventsPage;
