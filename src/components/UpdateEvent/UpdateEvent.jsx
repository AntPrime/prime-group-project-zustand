import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Divider, Tabs, Tab,  Snackbar, Alert } from "@mui/material";
import ActivitySelect from "../ActivitySelect/ActivitySelect";
import SchoolSelect from "../SchoolSelect/SchoolSelect";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";
import CreateNewActivity from "../CreateNewActivity/CreateNewActivity";

function UpdateEvent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { event } = location.state || {}; 
  const [updatedEvent, setUpdatedEvent] = useState(event || {
    activities_id: [],
    title: "",
    date: "",
    time: "",
    school_id: [],
    location: "",
    channel: "",
    notes: ""
  });

  // Initialize selectedSchoolIds and selectedActivityIds based on event data
  const [selectedSchoolIds, setSelectedSchoolIds] = useState(event?.school_id || []);
  const [selectedActivityIds, setSelectedActivityIds] = useState(event?.activities_id || []);
  const [schools, setSchools] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [userRole, setUserRole] = useState('');
  const user = useStore((state) => state.user);

  const redirectToHome = () => {
    if (user.admin_level === 2) {  // Check for superadmin
      navigate('/superAdminHome');
    } else {
      navigate('/adminHome'); // fallback to admin
    }
  };

  const handleCancel = () => {
    redirectToHome();
  };

  useEffect(() => {
    // Fetch schools and activities for the dropdowns
    axios.get('/api/createSchool/schools')
      .then((res) => setSchools(res.data))
      .catch((err) => console.error('Error fetching schools:', err));

    axios.get('/api/createActivity/activities')
      .then((res) => setActivities(res.data))
      .catch((err) => console.error('Error fetching activities:', err));
  }, []);

  const updateEvent = () => {
    const selectedSchoolId = selectedSchoolIds[0];
    const selectedActivityId = selectedActivityIds[0];
    if (!selectedSchoolId) {
      alert("Please select a school.");
      return;
    }
    if (!selectedActivityId) {
      alert("Please select an activity.");
      return;
    }
    const updatedEventData = {
      ...updatedEvent,
      school_id: selectedSchoolId,        
      activities_id: selectedActivityId,  
      id: updatedEvent.id               
    };
    console.log("Updated event data to send:", updatedEventData);
    // Send PUT request
    axios.put('/api/events', updatedEventData)
      .then((response) => {
        console.log("Event updated:", response.data);
        setSnackbarMessage(`Event "${updatedEvent.title}" updated`);
        setSnackbarOpen(true);
        setTimeout(() => {
          redirectToHome();
        }, 2000);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Error response status:", err.response.status);
          console.error("Error response data:", err.response.data);
          alert(`Error: ${err.response.data.message || "Unknown error occurred"}`);
        } else {
          console.error("Error:", err);
          alert("Network or server error while updating the event.");
        }
      });
  };

  const createEvent = () => {
    const newEvent = {
      ...updatedEvent,
      school_id: selectedSchoolIds,
      activities_id: selectedActivityIds,
    };
    axios.post('/api/events', newEvent)
      .then(function (response) {
        console.log(response.data);
        redirectToHome();
      })
      .catch(function (err) {
        console.log(err);
        alert('Error creating new event');
      });
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
            sx={{ alignSelf: 'stretch', textAlign: 'right' }}
          />
          <Tab
            label="Advanced Settings"
            sx={{ alignSelf: 'stretch', textAlign: 'right' }}
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, marginLeft: 10 }}>
        {/* Create Event Wrapper */}
        <Box sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 3, padding: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid #3498db', pb: 1.5, mb: 9 }}>
            Update Event
          </Typography>

          {/* Title */}
          <Typography variant="h6" sx={{ mb: 1 }}>Event Name</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter event name"
            value={updatedEvent.title}
            onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
            sx={{ backgroundColor: 'white', mb: 2 }}
          />

          {/* Date & Time */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="date"
              fullWidth
              value={updatedEvent.date}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
              sx={{ backgroundColor: 'white', mb: 2 }}
            />
            <TextField
              type="time"
              fullWidth
              value={updatedEvent.time}
              onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}
              sx={{ backgroundColor: 'white', mb: 2 }}
            />
          </Box>

          {/* Location */}
          <Typography variant="h6" sx={{ mb: 1 }}>Location</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add location"
            value={updatedEvent.location}
            onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
            sx={{ backgroundColor: 'white', mb: 2 }}
          />

          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
              <SchoolSelect
                key={schools.length}
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
                key={schools.length}
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
              <Divider sx={{ my: 3 }} />
            </Box>
          )}

          {/* Notes */}
          <Typography variant="h6" sx={{ mb: 1 }}>Enter description</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter description"
            value={updatedEvent.notes}
            onChange={(e) => setUpdatedEvent({ ...updatedEvent, notes: e.target.value })}
            sx={{ backgroundColor: 'white', mb: 2 }}
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="contained" sx={{ bgcolor: '#B0B0B0', '&:hover': { bgcolor: '#8C8C8C' }, textTransform: 'none', borderRadius: '3px', px: 5, py: 1 }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" sx={{ bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' }, textTransform: 'none', borderRadius: '3px', px: 5, py: 1 }} onClick={updateEvent}>
              Update Event
            </Button>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
}

export default UpdateEvent;
