import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
 Accordion,
 AccordionSummary,
 AccordionDetails,
 AccordionActions,
 Typography
} from '@mui/material';
import {
 List,
 ListItem,
 ListItemText,
 Box,
 Divider
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import Button from '@mui/material/Button';
import SearchEvent from '../SearchEvent/SearchEvent.jsx';
import { NavLink } from 'react-router-dom';
import axios from 'axios'


function AdminHome() {
 const user = useStore((state) => state.user);
 const logOut = useStore((state) => state.logOut);
 const [eventList, setEventList] = useState([]);
 const [sortBy, setSortBy] = useState(null);
 const [sortOrder, setSortOrder] = useState({
   date: "asc", // Default: Soonest first
   location: "asc", // Default: A-Z
 });
 const [events, setEvents] = useState([]);
 const ROLE_MAPPING = {
   'play-by-play': 'play_by_play',
   'color commentator': 'color_commentator',
   'camera': 'camera',
   'producer': 'producer'
 };
 const handleParticipantmarked = (eventId, role) => {
   const apiRole = ROLE_MAPPING[role.toLowerCase()];
  
 
   axios({
     method: 'PUT',
     url: `/api/events/attended/${eventId}`,
     data: { role: apiRole }
   })
   .then(() => {
     console.log('Successfully toggled attendance');
     fetchEvent();
   })
   .catch((error) => {
     console.log('Error updating attendance', error);
   });
 };
 const fetchEvent = () => {
   console.log("fetching..")
   axios({
     method: "GET",
     url: "/api/events/all"
   })
     .then((response) => {
       console.log("Response: ", response.data)
       // adding the DB contents into the empty array above
       setEventList(response.data)
     })
     .catch((err) => {
       console.log("GET /api/event is broken")
     })
 }


 useEffect(() => {
   fetchEvent();
 }, []);
 useEffect(() => {
   console.log(eventList);
   setEvents(eventList.map(event => ({
     ...event,
     participants: [
       {
         role: 'Play-by-Play',
         userId: event.play_by_play,
         username: event.play_by_play_username,
         marked: event.play_by_play_attended || false
       },
       {
         role: 'Color Commentator',
         userId: event.color_commentator,
         username: event.color_commentator_username,
         marked: event.color_commentator_attended || false
       },
       {
         role: 'Camera',
         userId: event.camera,
         username: event.camera_username,
         marked: event.camera_attended || false
       },
       {
         role: 'Producer',
         userId: event.producer,
         username: event.producer_username,
         marked: event.producer_attended || false
       }
     ].filter(p => p.userId)
   })));
 }, [eventList]);
  return (
   <>
     <h2>LMR ADMIN HOME PAGE</h2>
     <SearchEvent eventList={eventList} setEventList={setEventList}/>
     <div className='eventCard'>
       {events.length > 0 ? (
         events.map((event, index) => ( // Changed from eventList to events
           <Accordion
             key={index}
             sx={{
               mb: 2,
               backgroundColor: event.isMarked ? 'lightgreen' : 'inherit',
               transition: 'background-color 0.3s ease'
             }}
           >
             <AccordionSummary expandIcon={<IoIosArrowDropdown />}>
               <div style={{ width: '100%' }}>
                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                   {event.title} {event.isMarked && ' ✓'}
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   Date: {event.date} | Time: {event.time} | Channel: {event.channel}
                 </Typography>
                 <Typography variant="body2">
                   Schools: {event.school_name} vs [Opponent Name] | Location: {event.location}
                 </Typography>
               </div>
             </AccordionSummary>
             <NavLink to={`/updateEvent/${event.id}`} state={{event}}  style={{ textDecoration: 'none' }}>
                 <Button variant="contained">
                   Update Event
                 </Button>
               </NavLink>
             <AccordionDetails>
               <Divider sx={{ my: 2 }} />
               <Typography variant="h6" sx={{ mb: 1 }}>
                 Assigned Roles ({event.participants.length})
               </Typography>


               <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                 {event.participants.map((participant, pIndex) => (
                   <ListItem
                     key={pIndex}
                     sx={{
                       backgroundColor: participant.isMarked ? 'lightgreen' : 'inherit',
                       transition: 'background-color 0.3s ease',
                       mb: 1,
                       borderRadius: 1
                     }}
                   >
                     <ListItemText
                       primary={participant.username}
                       secondary={`Role: ${participant.role}`}
                       sx={{
                         '& .MuiListItemText-secondary': {
                           color: 'text.secondary',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                     <Box sx={{ ml: 'auto' }}>
                       <Button
                         size="small"
                         variant="outlined"
                         color={participant.marked ? 'success' : 'primary'}
                         onClick={() => handleParticipantmarked(event.id, participant.role)}
                       >
                         {participant.marked ? 'Attended ✓' : 'Signed Up'}
                       </Button>
                     </Box>
                   </ListItem>
                 ))}
               </List>
             </AccordionDetails>
          
           </Accordion>
         ))
       ) : (
         <p>No events available</p>
       )}
     </div>
   </>
 );
}


export default AdminHome;
