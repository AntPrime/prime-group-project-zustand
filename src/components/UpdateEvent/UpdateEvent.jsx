
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Select, MenuItem, Button, Typography, Grid } from "@mui/material";

function UpdateEvent( ) {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};
  const [ updatedEvent, setUpdatedEvent ]=useState(event ||{ 
    activities_id: 0,
    title: "",
    date: "",
    time: "",
    school_id: 0,
    location: "",
    channel: "",
    notes: ""
  });

  const update=(e)=>{
    axios.put(`/api/events`, updatedEvent ).then(( response  )=>{
      console.log( "UpdateEvent PUT", response.data );
      navigate("/"); 
        }).catch(( err )=>{
          console.log("error in UpdateEvent", err );
        });
    };

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Update Event
        </Typography>
  
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={updatedEvent.title}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
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
              value={updatedEvent.date}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
            />
          </Grid>
  
          {/* Start Time Field */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="time"
              label="Start Time"
              InputLabelProps={{ shrink: true }}
              value={updatedEvent.time}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}
            />
          </Grid>
  
          {/* End Time Field */}
    
        </Grid>
  
        <TextField
          fullWidth
          label="Location"
          variant="outlined"
          value={updatedEvent.location}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
  
        <Select
          fullWidth
          value={updatedEvent.school_id}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, school_id: Number(e.target.value) })}
          displayEmpty
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value={0}>Select School</MenuItem>
          <MenuItem value={1}>Albert Lea</MenuItem>
          <MenuItem value={2}>Fairbault</MenuItem>
          <MenuItem value={3}>Northfield</MenuItem>
        </Select>
  
        <Select
          fullWidth
          value={updatedEvent.activities_id}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, activities_id: Number(e.target.value) })}
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
  
        <TextField
          fullWidth
          label="Notes"
          variant="outlined"
          multiline
          rows={4}
          value={updatedEvent.notes}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, notes: e.target.value })}
          sx={{ marginBottom: 3 }}
          InputProps={{
            style: {
              resize: 'both',
              overflow: 'auto',
            },
          }}
        />
  
        <Button variant="contained" color="primary" fullWidth onClick={update}>
          Update Event
        </Button>
      </Container>
    );
  }
  
  export default UpdateEvent;
