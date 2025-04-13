import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { Box, Container, TextField, Select, MenuItem, Button, Typography, Tabs, Tab, Divider, Snackbar, Alert} from "@mui/material";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";
import CreateNewActivity from "../CreateNewActivity/CreateNewActivity";
import ActivitySelect from "../ActivitySelect/ActivitySelect";
import SchoolSelect from "../SchoolSelect/SchoolSelect";




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
 const [activities, setActivities] = useState([]);
 const [activeTab, setActiveTab] = useState('details');
 const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
 const [selectedActivityIds, setSelectedActivityIds] = useState([]);
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [userRole, setUserRole] = useState('');
 const user = useStore((state) => state.user);
 const [selectedSchoolId, setSelectedSchoolId] = useState('');
 const [selectedActivityId, setSelectedActivityId] = useState('');
useEffect(() => {
  setUserRole(user?.role || 'admin');
}, [user]);


 useEffect(() => {
   fetchEvents();
     // Optionally fetch user role (this depends on how your app stores user info)
  axios.get('/api/user/all') // <-- Adjust to your actual user session endpoint
  .then((res) => {
    setUserRole(res.data.role); // Make sure res.data.role returns "admin" or "superadmin"
  })
  .catch((err) => {
    console.error("Failed to fetch user role", err);
  });
   // Fetch all schools
   axios.get('/api/createSchool/schools')
     .then((res) => {
       console.log('Schools fetched:', res.data);
       setSchools(res.data);
     })
     .catch((err) => {
       console.error('Error fetching schools:', err.response || err.message);
       alert('Error fetching schools');
     });
   // Fetch activities
   axios.get('/api/createActivity/activities')
     .then((res) => {
       console.log('Activities fetched:', res.data);
       setActivities(res.data);
     })
     .catch((err) => {
       console.error('Error fetching activities:', err.response || err.message);
       alert('Error fetching activities');
     });
 }, [fetchEvents]);

 console.log("User Role:", userRole);  // Debugging lin
 // POST to create a new event
 const createEvent = () => {
   console.log('in createEvent');
   console.log('newEvent:', newEvent);
    const updatedEvent = {
     ...newEvent,
     school_id: selectedSchoolIds[0],
     activities_id: selectedActivityIds[0],
   };
    axios.post('/api/events', updatedEvent)
     .then(function (response) {
       console.log(response.data);
       fetchEvents();
       setSnackbarMessage(`Event "${newEvent.title}" created`);
       setSnackbarOpen(true);
       setTimeout(() => {
        if (user.admin_level === 2) {  // Check for super admin level
          navigate("/superAdminHome");
        } else {
          navigate("/adminHome");
        }
      }, 1500);
     })
     .catch(function (err) {
       console.log(err);
       alert('Error creating new event');
     });
 };

 const handleCancel = () => {
  if (user.admin_level === 2) {  // Check for super admin level
    navigate('/superAdminHome');
  } else {
    navigate('/adminHome'); // fallback to adminHome
  }
};

const textFieldStyle = {
  mb: 2,
  borderRadius: '5px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
  },
};


return (
    <Box sx={{ display: 'flex', height: '100%', padding: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: '220px', borderRight: '1px solid #ccc' }}>
        <Tabs
          orientation="vertical"
          value={activeTab === 'details' ? 0 : 1}
          onChange={(e, newValue) => setActiveTab(newValue === 0 ? 'details' : 'advanced')}
          aria-label="Vertical tabs"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
        >
          <Tab
            label="Details"
            sx={{
              alignSelf: 'stretch',
              textAlign: 'right',
            }}
          />
          <Tab
            label="Advanced Settings"
            sx={{
              alignSelf: 'stretch',
              textAlign: 'right',
            }}
          />
        </Tabs>
      </Box>
  
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, marginLeft: 10 }}>
        {/* Create Event Wrapper */}
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 3, padding: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid #3498db', pb: 1.5, mb: 9 }}>
            Create Event
          </Typography>
        
  
          {/* Title */}
          <Typography variant="h6" sx={{ mb: 1 }}>Event Name</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter event name"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            sx={{ ...textFieldStyle, backgroundColor: 'white' }}
          />
  
          {/* Date & Time */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="date"
              fullWidth
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              sx={{ ...textFieldStyle, backgroundColor: 'white' }}
            />
            <TextField
              type="time"
              fullWidth
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              sx={{ ...textFieldStyle, backgroundColor: 'white' }}
            />
          </Box>
  
          {/* Location */}
          <Typography variant="h6" sx={{ mb: 1 }}>Location</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            sx={{ ...textFieldStyle, backgroundColor: 'white' }}
          />
  
          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
             <SchoolSelect
  key={schools.length} // This will change every time schools array changes
  schools={schools}
  selectedSchools={selectedSchoolIds}
  onChange={setSelectedSchoolIds}
/>
              <ActivitySelect
                activities={activities}
                selectedActivities={selectedActivityIds}
                onChange={setSelectedActivityIds}
              />
            </>
          )}
  
          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <Box sx={{ mb: 2 }}>
              <CreateNewSchool
                  setSchools={setSchools}
                  schools={schools}
                />
                <Divider sx={{ my: 3 }} />
                 <SchoolSelect
                schools={schools}
                selectedSchools={selectedSchoolIds}
                onChange={setSelectedSchoolIds}
              />
                <CreateNewActivity
                  setActivities={setActivities}
                  activities={activities}
                />
              <Divider sx={{ my: 3 }} />
              <ActivitySelect
                activities={activities}
                selectedActivities={selectedActivityIds}
                onChange={setSelectedActivityIds}
              />
            </Box>
          )}
          
  
          {/* Channel */}
          <Typography variant="h6" sx={{ mb: 1 }}>Channel</Typography>
          <Select
            fullWidth
            value={newEvent.channel}
            onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value })}
            displayEmpty
            sx={{ ...textFieldStyle, backgroundColor: 'white' }}
            renderValue={(selected) => {
              if (!selected) return <span style={{ color: '#aaa' }}>Select channel</span>;
              return selected;
            }}
          >
            <MenuItem value="Albert Lea Live">Albert Lea Live</MenuItem>
            <MenuItem value="Fairbault Live">Fairbault Live</MenuItem>
            <MenuItem value="Northfield Live">Northfield Live</MenuItem>
          </Select>
  
          {/* Notes */}
          <Typography variant="h6" sx={{ mb: 1 }}>Enter description</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter description"
            value={newEvent.notes}
            onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
            sx={{ ...textFieldStyle, backgroundColor: 'white' }}
          />
  
          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#B0B0B0', // Muted grey color for the cancel button
                '&:hover': { bgcolor: '#8C8C8C' }, // Darker grey on hover
                textTransform: 'none',
                borderRadius: '3px',
                px: 5, // Horizontal padding
                py: 1, // Vertical padding
                width: 'auto', // Adjust width to content size
              }}
              onClick={handleCancel}
            >
              Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#3498db',
                  '&:hover': { bgcolor: '#2980b9' },
                  textTransform: 'none',
                  borderRadius: '3px',
                  px: 5,
                  py: 1.5, // Slightly smaller vertical padding
                  width: 'auto', // Adjust width to content size
                }}
                onClick={createEvent}
              >
                Create
              </Button>
            </Box>

          {/* Snackbar */}
          <Snackbar
  open={snackbarOpen}
  autoHideDuration={2000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>
        </Box>
      </Container>
    </Box>
  );
}


export default EventsPage;



