import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { Container, TextField, Select, MenuItem, Button, Typography, Grid } from "@mui/material";

function EventsPage() {
  const [newEvent, setNewEvent] = useState({
    activities_id: 0,
    title: "",
    date: "",
    start_time: "",
    end_time: "",
    school_id: 0,
    location: "",
    channel: "",
    notes: ""
  });
  const fetchEvents = useStore((state) => state.fetchEvents)
  const navigate = useNavigate();

useEffect(()=> {
  fetchEvents()
}, [] );

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


  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add an Event
      </Typography>

      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        sx={{ marginBottom: 2 }}
      />

      {/* Use Grid for Date and Time fields */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
        </Grid>
     
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"    // Label for start time
            value={newEvent.start_time}  // Bind to start_time state
            onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
          />
        </Grid>
      </Grid>

<Grid container spacing={2} sx={{ marginBottom: 2 }}>
  <Grid item xs={6}>
    <TextField
      fullWidth
      type="time"
      label="End Time"      // Label for end time
      value={newEvent.end_time}    // Bind to end_time state
      onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
    />
  </Grid>
</Grid>

      <TextField
        fullWidth
        label="Location"
        variant="outlined"
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        sx={{ marginBottom: 2 }}
      />

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

      <Select
        fullWidth
        value={newEvent.school_id}
        onChange={(e) => setNewEvent({ ...newEvent, school_id: Number(e.target.value) })}
        displayEmpty
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value={0}>Select School</MenuItem>
        <MenuItem value={1}>Alber Lea</MenuItem>
        <MenuItem value={2}>Fairbault</MenuItem>
        <MenuItem value={3}>Northfield</MenuItem>
      </Select>

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

      {/* Resizable Notes Field */}
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

      <Button variant="contained" color="primary" fullWidth onClick={createEvent}>
        Add Event
      </Button>
    </Container>
  );
}

export default EventsPage;
