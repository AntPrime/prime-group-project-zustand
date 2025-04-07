import axios from 'axios';
import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Accordion, Button, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import DeleteEvent from '../DeleteEvent/DeleteEvent';
import SearchEvent from '../SearchEvent/SearchEvent';

function SuperAdminHome() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);
  const [events, setEvents] = useState([]);

  // Payment handlers
  const handleMarkmarked = (index) => {
    setEvents(prev => prev.map((event, idx) => {
      if (idx !== index) return event;
      return { ...event, isMarked: !event.isMarked };
    }));
  };

  const ROLE_MAPPING = {
    'play-by-play': 'play_by_play',
    'color commentator': 'color_commentator',
    'camera': 'camera',
    'producer': 'producer'
  };
  const handleParticipantmarked = (eventId, role) => {
    // Convert role to snake_case for the API
    const apiRole = ROLE_MAPPING[role.toLowerCase()];
    
    // No need to calculate current status - server handles the toggle
    axios({
      method: 'PUT',
      url: `/api/events/attended/${eventId}`,
      data: { role: apiRole }
    })
    .then(() => {
      console.log('Successfully toggled attendance');
      fetchEvent(); // Refresh the event list after update
    })
    .catch((error) => {
      console.log('Error updating attendance', error);
    });
  };

  // Data fetching
  const fetchEvent = () => {
    axios.get("/api/events/all")
      .then((response) => {
        setEventList(response.data);
      })
      .catch((err) => {
        console.error("GET /api/events/all error:", err);
      });
  };

  // Initial data load
  useEffect(() => {
    fetchEvent();
  }, []);

  // Update events when eventList changes
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
      <h2>LMR SUPER ADMIN HOME PAGE</h2>
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
              <NavLink to={`/updateEvent/${event.id}`} state={{event}} style={{ textDecoration: 'none' }}>
                  <Button variant="contained">
                    Update Event
                  </Button>
                </NavLink>
                <Box className="float-Button" sx={{ backgroundColor: 'red', display: 'inline-block' }}>
                <DeleteEvent eventId={event.id} />
              </Box>
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

                <Button
                  variant="contained"
                  color={event.isMarked ? 'success' : 'primary'}
                  onClick={() => handleMarkmarked(index)}
                  sx={{ mt: 2 }}
                >
                  {event.isMarked ? 'Mark Event Unmarked' : 'Mark Entire Event Reviewed'}
                </Button>
               
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
export default SuperAdminHome;