import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Divider, AccordionActions, Alert, Snackbar, Button, Paper, Box, Typography, Chip } from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import moment from 'moment';
import SearchEvent from '../SearchEvent/SearchEvent.jsx';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';



function StudentHomePage() {
 const user = useStore((state) => state.user);
 const logOut = useStore((state) => state.logOut);
 const [eventList, setEventList] = useState([]);
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState(''); 



 useEffect(()=> {
   fetchEventList()
 }, [] );


   // GET fetchEventList
   function fetchEventList() {
     console.log( 'in fetchEventList' );
     axios.get( '/api/events/all' ).then(function( response ){
       console.log( response.data )
       setEventList( response.data )
     }).catch( function( err ){
           console.log( err );
           alert( 'error getting test list' );
         })
   }


   // PUT Assign user role
   function assignRoles(event, roleColumn) {
     console.log('Assign user to role:', { eventId: event.id, roleColumn: roleColumn });
     axios.put( '/api/assignRole/assignRole', {
       eventId: event.id,
       roleColumn,
     }).then(function(response){
       // setEventList(response.data);
       setEventList((prevEvents) =>
         prevEvents.map((prevEvent) =>
           prevEvent.id === response.data.id ? response.data : prevEvent ));
      // 👇 Snackbar logic
      const roleName = roleColumn.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Pretty role name
      const userName = useStore.getState().user.username; // Get username directly
      
      setSnackbarMessage(`${userName} successfully signed up as ${roleName}`);
      setSnackbarOpen(true);
       fetchEventList();
     }).catch(function() {
       alert('Error assigning role');
     });
   }

   function formatDate(dateString) {
    return moment(dateString).format("MMMM D, YYYY"); 
    // Example: November 12 2025
  }
  
  function formatTime(timeString) {
    return moment(timeString, "HH:mm:ss").format("h:mma"); 
    // Example: 4:30 pm
  }

  function getDayAbbreviation(dateString) {
    return moment(dateString).format("ddd"); // e.g., "Fri"
  }
  
  function getDayNumber(dateString) {
    return moment(dateString).format("D"); // e.g., "12"
  }
  
  
  return (
    <>
<Paper
  elevation={1}
  sx={{
    backgroundColor: 'transparent',
    boxShadow: 'none',
    p: 2,
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  }}
>
<h2>LMR STUDENT HOME PAGE</h2>
  <SearchEvent eventList={eventList} setEventList={setEventList} />
</Paper>

      {/* Event List Container */}
      <Box sx={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
      {eventList.length > 0 ? (
  eventList.map((event, index) => (
    <Paper
      key={index}
      elevation={2}
      sx={{
        mb: 0,
        p: 1,
        backgroundColor: '#fff',
        borderRadius: 0,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Accordion elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <AccordionSummary
          expandIcon={<IoIosArrowDropdown />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
        >
          {/* Your Day/Date Box and Event Info as-is */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box
              sx={{
                minWidth: '60px',
                textAlign: 'center',
                mr: 2,
                borderRight: '1px solid #ccc',
                pr: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {getDayAbbreviation(event.date)}
              </Typography>
              <Typography variant="h6">{getDayNumber(event.date)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: 1 }}>
              <Typography component="span" sx={{ pl: 1 }}>
                {formatDate(event.date)} {formatTime(event.time)}
              </Typography>
              <Typography component="h3" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mt: 1, pl: 1 }}>
                {event.title} {event.activity || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, pl: 1 }}>
                <strong>Streaming Channel:</strong> {event.channel}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, pl: 1, fontWeight: 'normal', fontSize: '0.875rem' }}>
                <LocationOnIcon sx={{ color: 'red', fontSize: '1rem', mr: 0.5 }} />
                {event.location || "N/A"}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
  <Divider sx={{ mb: 2 }} />
  <Box
    sx={{
      borderRadius: 2,
      px: 4,
      py: 3,
      ml: 8,
      mr: 8,
      mb: 4,
    }}
  >
    <Typography variant="body2" sx={{ fontSize: '1rem' }}>
      {event.notes || "N/A"}
    </Typography>
  </Box>
</AccordionDetails>

<AccordionActions sx={{ flexDirection: 'column', alignItems: 'flex-start', pl: 13, mb: 3 }}>
  <Typography variant="h8" sx={{ mb: 4 }}>
    <span style={{ fontWeight: 'bold' }}>Sign up below to attend </span>
    <span style={{ fontWeight: 'bold' }}>{event.school_name || "N/A"}</span>
  </Typography>

  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
    {[
      { label: 'Producer', key: 'producer' },
      { label: 'Camera', key: 'camera' },
      { label: 'Play-by-Play', key: 'play_by_play' },
      { label: 'Color Commentator', key: 'color_commentator' }
    ].map((role) => (
      <Chip
        key={role.key}
        label={role.label}
        color={event[role.key] ? "primary" : "default"}
        onClick={() => assignRoles(event, role.key)}
        disabled={!!event[role.key]}
        sx={{
          borderRadius: '20px',
          borderWidth: '1.5px',
          fontWeight: '500',
          cursor: event[role.key] ? 'default' : 'pointer',
          '&:hover': !event[role.key] && {
            backgroundColor: '#2980b9',
            color: 'white',
          }
        }}
      />
    ))}
  </Box>
</AccordionActions>





      </Accordion>
    </Paper>
  ))
) : (
  <p>No events available</p>
)}

      </Box>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={4000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Change to top-center
>
  <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>


    </>
  );
  
}



export default StudentHomePage;

{/* <AccordionActions sx={{ flexDirection: 'column', alignItems: 'flex-start', pl: 13 }}>
<Typography variant="h8" sx={{ mb: 1 }}>
  <span style={{ fontWeight: 'bold' }}>Sign up below to attend </span>
  <span style={{ fontWeight: 'bold' }}>{event.school_name || "N/A"}</span>
</Typography>

<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
      {event.producer_username ? event.producer_username : 'Unassigned'}
    </Typography>
    <Chip 
      label="Producer" 
      color={event.producer ? "primary" : "default"}
      onClick={() => assignRoles(event, "producer")}
      disabled={!!event.producer}
      sx={{ 
        borderRadius: '20px',
        borderWidth: '1.5px',
        fontWeight: '500',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#2980b9', // Change to blue on hover
          borderColor: '#2980b9',
        }
      }}
    />
  </Box>


  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
      {event.camera_username ? event.camera_username : 'Unassigned'}
    </Typography>
    <Chip 
      label="Camera" 
      color={event.camera ? "primary" : "default"}
      onClick={() => assignRoles(event, "camera")}
      disabled={!!event.camera}
      sx={{ 
        borderRadius: '20px',
        borderWidth: '1.5px',
        fontWeight: '500',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#2980b9', // Change to blue on hover
          borderColor: '#2980b9',
        }
      }}
    />
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
      {event.play_by_play_username ? event.play_by_play_username : 'Unassigned'}
    </Typography>
    <Chip 
      label="Play-by-Play" 
      color={event.play_by_play ? "primary" : "default"}
      onClick={() => assignRoles(event, "play_by_play")}
      disabled={!!event.play_by_play}
      sx={{ 
        borderRadius: '20px',
        borderWidth: '1.5px',
        fontWeight: '500',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#2980b9', // Change to blue on hover
          borderColor: '#2980b9',
        }
      }}
    />
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
      {event.color_commentator_username ? event.color_commentator_username : 'Unassigned'}
    </Typography>
    <Chip 
      label="Color Commentator" 
      color={event.color_commentator ? "primary" : "default"}
      onClick={() => assignRoles(event, "color_commentator")}
      disabled={!!event.color_commentator}
      sx={{ 
        borderRadius: '20px',
        borderWidth: '1.5px',
        fontWeight: '500',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#2980b9', 
          borderColor: '#2980b9',
        }
      }}
    />
  </Box>
</Box>
</AccordionActions> */}



