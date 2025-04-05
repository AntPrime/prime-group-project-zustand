import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { Box, Container, TextField, Select, MenuItem, Button, Typography, Grid, Divider } from "@mui/material";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";
import CreateNewActivity from "../CreateNewActivity/CreateNewActivity"; 
import ActivitySelect from "../ActivitySelect/ActivitySelect";  
import moment from 'moment';

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
  const [activeTab, setActiveTab] = useState('details');


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
    <Box sx={{ display: 'flex', height: '100%', padding: 2 }}>
    {/* Sidebar */}
    <Box sx={{ width: '220px', paddingRight: 4, borderRight: '1px solid #ccc' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Settings</Typography>
  
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography
          variant="body1"
          sx={{
            cursor: 'pointer',
            fontWeight: activeTab === 'details' ? 'bold' : 'normal',
            textDecoration: activeTab === 'details' ? 'underline' : 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => setActiveTab('details')}
        >
          Details
        </Typography>
  
        <Typography
          variant="body1"
          sx={{
            cursor: 'pointer',
            fontWeight: activeTab === 'advanced' ? 'bold' : 'normal',
            textDecoration: activeTab === 'advanced' ? 'underline' : 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Settings
        </Typography>
      </Box>
    </Box>
  
    {/* Main Content */}
    <Container maxWidth="md" sx={{ flex: 1, marginLeft: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Create Event
      </Typography>

      {/* Title */}
      <Typography variant="h6" sx={{ mb: 1 }}>Event Name</Typography>
      <TextField fullWidth variant="outlined" placeholder="Enter event name"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        sx={textFieldStyle}
      />

      {/* Date/Time */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          type="date"
          fullWidth
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          sx={textFieldStyle}
        />
        <TextField
          type="time"
          fullWidth
          value={newEvent.time}
          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          sx={textFieldStyle}
        />
      </Box>

      {/* Description Text */}
      {(newEvent.date || newEvent.time) && (
        <Typography sx={{ mb: 2, fontStyle: 'italic' }}>
          {`This event will take place${newEvent.date ? ` on ${moment(newEvent.date).format("MMMM D, YYYY")}` : ''}${newEvent.time ? ` at ${moment(newEvent.time, "HH:mm").format("h:mm A")}` : ''}`}
        </Typography>
      )}

      {/* Location */}
      <Typography variant="h6" sx={{ mb: 1 }}>Location</Typography>
      <TextField fullWidth variant="outlined" placeholder="Enter location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        sx={textFieldStyle}
      />

<Typography variant="h6" sx={{ mb: 1 }}>School</Typography>
<Select
  fullWidth
  value={newEvent.school_id}
  onChange={(e) => setNewEvent({ ...newEvent, school_id: e.target.value })}
  displayEmpty
  sx={textFieldStyle}
>
  <MenuItem value="">Select School</MenuItem>
  {schools.map((school) => (
    <MenuItem key={school.id} value={school.id}>
      {school.name}
    </MenuItem>
  ))}
</Select>

<Typography variant="h6" sx={{ mb: 1 }}>Activity</Typography>
<Select
  fullWidth
  value={newEvent.activities_id}
  onChange={(e) => setNewEvent({ ...newEvent, activities_id: e.target.value })}
  displayEmpty
  sx={textFieldStyle}
>
  <MenuItem value="">Select Activity</MenuItem>
  {activities.map((activity) => (
    <MenuItem key={activity.id} value={activity.id}>
      {activity.name}
    </MenuItem>
  ))}
</Select>

      {/* Schools & Activities */}
      {activeTab === 'advanced' && (
        <Box sx={{ mb: 2 }}>
          <CreateNewSchool setSchools={setSchools} schools={schools} />
          <CreateNewActivity setActivities={setActivities} activities={activities} />
          <Divider sx={{ my: 3 }} />
        </Box>
      )}

      {/* Channel Dropdown */}
      <Select
        fullWidth
        value={newEvent.channel}
        onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value })}
        displayEmpty
        sx={{
          ...textFieldStyle, // reuse your existing style
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #b0b0b0', // grey focus border
          },
        }}
      >
        <MenuItem value="">Select Channel</MenuItem>
        <MenuItem value="Albert Lea Live">Albert Lea Live</MenuItem>
        <MenuItem value="Fairbault Live">Fairbault Live</MenuItem>
        <MenuItem value="Northfield Live">Northfield Live</MenuItem>
      </Select>

      {/* Notes */}
      <Typography variant="h6" sx={{ mb: 1 }}>Add description</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Enter description"
        value={newEvent.notes}
        onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
        sx={textFieldStyle}
      />

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button fullWidth variant="contained" sx={cancelBtnStyle}>Cancel</Button>
        <Button fullWidth variant="contained" onClick={createEvent} sx={saveBtnStyle}>Add Event</Button>
      </Box>
    </Container>
  </Box>
);
}

const textFieldStyle = {
backgroundColor: '#F2F4F5',
mb: 2,
'& .MuiOutlinedInput-root': {
  '& fieldset': { border: 'none' },
  '&:hover fieldset': { border: 'none' },
  '&.Mui-focused fieldset': { border: '2px solid #b0b0b0' },
},
borderRadius: '8px',
};

const saveBtnStyle = {
backgroundColor: '#081C32',
color: '#fff',
'&:hover': { backgroundColor: '#061629' }
};

const cancelBtnStyle = {
backgroundColor: '#ccc',
color: '#000',
'&:hover': { backgroundColor: '#aaa' }
};

export default EventsPage;

