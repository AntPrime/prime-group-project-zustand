import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Divider } from "@mui/material";
import ActivitySelect from "../ActivitySelect/ActivitySelect";
import SchoolSelect from "../SchoolSelect/SchoolSelect";
import CreateNewSchool from "../CreateNewSchool/CreateNewSchool";
import CreateNewActivity from "../CreateNewActivity/CreateNewActivity";



function UpdateEvent() {
 const location = useLocation();
 const navigate = useNavigate();
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


 const [schools, setSchools] = useState([]);
 const [activities, setActivities] = useState([]);
 const [activeTab, setActiveTab] = useState('details');
 const [selectedSchoolIds, setSelectedSchoolIds] = useState([]);
 const [selectedActivityIds, setSelectedActivityIds] = useState([]);
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
         // Navigate based on user admin level
         redirectToHome();
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
   const newEvent = {
     ...updatedEvent,
     school_id: selectedSchoolIds,
     activities_id: selectedActivityIds,
   };
   axios.post('/api/events', newEvent)
     .then(function (response) {
       console.log(response.data);
   // Navigate based on user admin level after creating event
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
         label="Add location"
         variant="outlined"
         value={updatedEvent.location}
         onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
         sx={{ marginBottom: 2 }}
       />


       {/* Details Tab */}
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


       {/* Advanced Settings Tab */}
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
         label="Enter description"
         variant="outlined"
         multiline
         rows={4}
         value={updatedEvent.notes}
         onChange={(e) => setUpdatedEvent({ ...updatedEvent, notes: e.target.value })}
         sx={{ marginBottom: 2 }}
       />


          {/* Update Button */}
          <Box sx={{ display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={handleCancel}>
  Cancel
</Button>

<Button fullWidth variant="contained" onClick={event ? updateEvent : createEvent}>
  {event ? 'Update Event' : 'Create Event'}
</Button>

        </Box>
     </Container>
   </Box>
 );
}

export default UpdateEvent;

