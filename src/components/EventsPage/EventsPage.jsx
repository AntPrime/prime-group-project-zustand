import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import { Box, Container, TextField, Select, MenuItem, Button, Typography, Divider, Snackbar, Alert} from "@mui/material";
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


 useEffect(() => {
   fetchEvents();
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
       setSnackbarMessage(`✅ Event "${newEvent.title}" created!`);
       setSnackbarOpen(true);
       setTimeout(() => navigate("/studentHomePage"), 1500);
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


       {/* Location */}
       <Typography variant="h6" sx={{ mb: 1 }}>Location</Typography>
       <TextField fullWidth variant="outlined" placeholder="Add location"
         value={newEvent.location}
         onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
         sx={textFieldStyle}
       />


       {/* Details Tab */}
       {activeTab === 'details' && (
         <>
           <SchoolSelect
             schools={schools}
             selectedSchools={selectedSchoolIds}
             onChange={setSelectedSchoolIds} // Ensure this is updating correctly
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


       {/* Channel Title */}
       <Typography variant="h6" sx={{ mb: 1 }}>
         Channel
       </Typography>


       {/* Channel Select Dropdown */}
       <Select
         fullWidth
         value={newEvent.channel}
         onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value })}
         displayEmpty
         sx={{
           ...textFieldStyle,
         }}
         renderValue={(selected) => {
           if (!selected) {
             return <span style={{ color: '#aaa' }}>Select channel</span>;
           }
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
         sx={textFieldStyle}
       />


       {/* Buttons */}
       <Box sx={{ display: 'flex', gap: 2 }}>
         <Button fullWidth variant="contained" sx={cancelBtnStyle} onClick={() => navigate("/studentHomePage")}>
           Cancel
         </Button>
         <Button fullWidth variant="contained" onClick={createEvent} sx={saveBtnStyle}>
           Create
         </Button>
       </Box>


       <Snackbar
         open={snackbarOpen}
         autoHideDuration={2000}
         onClose={() => setSnackbarOpen(false)}
         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
         sx={{
           top: '40%',
           transform: 'translateY(-50%)',
           width: '100%',
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
         }}
       >
         <Alert
           onClose={() => setSnackbarOpen(false)}
           severity="success"
           variant="filled"
           sx={{
             width: '50%',
             fontSize: '1.2rem',
             padding: 3,
             borderRadius: 2,
             boxShadow: 5,
             textAlign: 'center',
             backgroundColor: '#d0f0c0',
             color: '#1a4d1a',
           }}
         >
           {snackbarMessage}
         </Alert>
       </Snackbar>
     </Container>
   </Box>
 );
}


const textFieldStyle = {
 backgroundColor: '#F2F4F5',
 mb: 2,
 '& .MuiOutlinedInput-root': {
   '& fieldset': {
     borderColor: 'rgba(0, 0, 0, 0.23)',
   },
   '&:hover fieldset': {
     borderColor: '#1976d2',
   },
   '&.Mui-focused fieldset': {
     borderColor: '#1976d2',
     borderWidth: 2,
   },
 },
};


const cancelBtnStyle = { backgroundColor: '#B0B0B0', color: '#fff' };
const saveBtnStyle = { backgroundColor: '#1976d2', color: '#fff' };


export default EventsPage;



