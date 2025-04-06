

import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Divider } from "@mui/material";
import ActivitySelect from "../ActivitySelect/ActivitySelect";
import SchoolSelect from "../SchoolSelect/SchoolSelect";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";
import CreateNewActivity from "../CreateNewActivity/CreateNewActivity";

function UpdateEvent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};  // Pass event data from location state
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

  const [schools, setSchools] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // Manage active tab state
  const [selectedSchoolIds, setSelectedSchoolIds] = useState(
    event?.school_id ? [event.school_id] : []
  );
  const [selectedActivityIds, setSelectedActivityIds] = useState(
    event?.activities_id ? [event.activities_id] : []
  );
  

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
  
    // Construct updated event payload
    const updatedEventData = {
      ...updatedEvent,
      school_id: selectedSchoolId,         // Only the first school
      activities_id: selectedActivityId,   // Only the first activity
      id: updatedEvent.id                  // Ensure ID is included
    };
  
    console.log("Updated event data to send:", updatedEventData);
  
    // Send PUT request
    axios.put('/api/events', updatedEventData)
      .then((response) => {
        console.log("Event updated:", response.data);
        navigate("/superAdminHome");
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
    console.log('in createEvent');
    console.log('newEvent:', updatedEvent);

    // Ensure that selectedSchoolIds and selectedActivityIds are passed correctly
    const newEvent = {
      ...updatedEvent,
      school_id: selectedSchoolIds, // Allow multiple schools to be selected
      activities_id: selectedActivityIds, // Allow multiple activities to be selected
    };

    axios.post('/api/events', newEvent)
      .then(function (response) {
        console.log(response.data);
        navigate("/superAdminHome");
      })
      .catch(function (err) {
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
          Update Event
        </Typography>

        {/* Title */}
        <Typography variant="h6" sx={{ mb: 1 }}>Event Name</Typography>
        <TextField fullWidth variant="outlined" placeholder="Enter event name"
          value={updatedEvent.title}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
          sx={{ mb: 2 }}
        />

        {/* Date/Time */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            fullWidth
            value={updatedEvent.date}
            onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            type="time"
            fullWidth
            value={updatedEvent.time}
            onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Location */}
        <TextField
          fullWidth
          label="Location"
          variant="outlined"
          value={updatedEvent.location}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
          sx={{ marginBottom: 2 }}
        />

        {/* Conditional Rendering for Details Tab */}
        {activeTab === 'details' && (
          <>
            <SchoolSelect
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

        {/* Conditional Rendering for Advanced Settings Tab */}
        {activeTab === 'advanced' && (
          <Box sx={{ mb: 2 }}>
            <CreateNewSchool setSchools={setSchools} schools={schools} />
            <CreateNewActivity setActivities={setActivities} activities={activities} />
            <Divider sx={{ my: 3 }} />
          </Box>
        )}

        {/* Notes */}
        <TextField
          fullWidth
          label="Notes"
          variant="outlined"
          multiline
          rows={4}
          value={updatedEvent.notes}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, notes: e.target.value })}
          sx={{ marginBottom: 2 }}
        />

        {/* Update Button */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/superAdminHome")}  // Add navigation or cancellation behavior
            sx={{ backgroundColor: '#B0B0B0', color: '#fff' }}
          >
            Cancel
          </Button>

<Button
  fullWidth
  variant="contained"
  onClick={event ? updateEvent : createEvent}  // Use updateEvent if editing, createEvent if creating
  sx={{ backgroundColor: '#1976d2', color: '#fff' }}
>
  {event ? 'Update Event' : 'Create Event'}
</Button>

        </Box>
      </Container>
    </Box>
  );
}

export default UpdateEvent;


// import axios from "axios";
// import { useState } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, TextField, Select, MenuItem, Button, Typography, Grid } from "@mui/material";

// function UpdateEvent( ) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { event } = location.state || {};
//   const [ updatedEvent, setUpdatedEvent ]=useState(event ||{ 
//     activities_id: 0,
//     title: "",
//     date: "",
//     time: "",
//     school_id: 0,
//     location: "",
//     channel: "",
//     notes: ""
//   });

//   const update=(e)=>{
//     axios.put(/api/events, updatedEvent ).then(( response  )=>{
//       console.log( "UpdateEvent PUT", response.data );
//       navigate("/superAdminHome", "/adminHome"); 
//         }).catch(( err )=>{
//           console.log("error in UpdateEvent", err );
//         });
//     };

//     return (
//       <Container maxWidth="sm" sx={{ marginTop: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Update Event
//         </Typography>
  
//         <TextField
//           fullWidth
//           label="Title"
//           variant="outlined"
//           value={updatedEvent.title}
//           onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
//           sx={{ marginBottom: 2 }}
//         />
  
//         <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//           {/* Date Field */}
//           <Grid item xs={4}>
//             <TextField
//               fullWidth
//               type="date"
//               label="Date"
//               InputLabelProps={{ shrink: true }}
//               value={updatedEvent.date}
//               onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
//             />
//           </Grid>
  
//           {/* Start Time Field */}
//           <Grid item xs={4}>
//             <TextField
//               fullWidth
//               type="time"
//               label="Start Time"
//               InputLabelProps={{ shrink: true }}
//               value={updatedEvent.time}
//               onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}
//             />
//           </Grid>
  
//           {/* End Time Field */}
    
//         </Grid>
  
//         <TextField
//           fullWidth
//           label="Location"
//           variant="outlined"
//           value={updatedEvent.location}
//           onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
//           sx={{ marginBottom: 2 }}
//         />
  
//         <Select
//           fullWidth
//           value={updatedEvent.school_id}
//           onChange={(e) => setUpdatedEvent({ ...updatedEvent, school_id: Number(e.target.value) })}
//           displayEmpty
//           sx={{ marginBottom: 2 }}
//         >
//           <MenuItem value={0}>Select School</MenuItem>
//           <MenuItem value={1}>Albert Lea</MenuItem>
//           <MenuItem value={2}>Fairbault</MenuItem>
//           <MenuItem value={3}>Northfield</MenuItem>
//         </Select>
  
//         <Select
//           fullWidth
//           value={updatedEvent.activities_id}
//           onChange={(e) => setUpdatedEvent({ ...updatedEvent, activities_id: Number(e.target.value) })}
//           displayEmpty
//           sx={{ marginBottom: 2 }}
//         >
//           <MenuItem value={0}>Select Activity</MenuItem>
//           <MenuItem value={1}>Basketball</MenuItem>
//           <MenuItem value={2}>Tennis</MenuItem>
//           <MenuItem value={3}>Football</MenuItem>
//           <MenuItem value={4}>Lacrosse</MenuItem>
//           <MenuItem value={5}>Hockey</MenuItem>
//         </Select>
  
//         <TextField
//           fullWidth
//           label="Notes"
//           variant="outlined"
//           multiline
//           rows={4}
//           value={updatedEvent.notes}
//           onChange={(e) => setUpdatedEvent({ ...updatedEvent, notes: e.target.value })}
//           sx={{ marginBottom: 3 }}
//           InputProps={{
//             style: {
//               resize: 'both',
//               overflow: 'auto',
//             },
//           }}
//         />
  
//         <Button variant="contained" color="primary" fullWidth onClick={update}>
//           Update Event
//         </Button>
//       </Container>
//     );
//   }
  
//   export default UpdateEvent
