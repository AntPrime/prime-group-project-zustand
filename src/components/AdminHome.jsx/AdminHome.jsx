import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, AccordionActions, Typography, Tabs, Tab, Box,
  Button, Divider, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import axios from 'axios';
import SearchEvent from '../SearchEvent/SearchEvent.jsx';
import StudentsTab from '../StudentsTab/StudentsTab';
import { NavLink } from 'react-router-dom';
import moment from 'moment'; 

function AdminHome() {
 const user = useStore((state) => state.user);
 const logOut = useStore((state) => state.logOut);
 const [eventList, setEventList] = useState([]);
 const [events, setEvents] = useState([]);
 const [activeTab, setActiveTab] = useState(0);
 const [selectedSchools, setSelectedSchools] = useState([]);
 const [selectedActivities, setSelectedActivities] = useState([]);


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
 const handleMarkmarked = (index) => {
  setEvents(prev => prev.map((event, idx) => {
    if (idx !== index) return event;
    return { ...event, isMarked: !event.isMarked };
  }));
};
const handleTabChange = (event, newValue) => {
  setActiveTab(newValue);
};
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

 
   function formatDate(dateString) {
     return moment(dateString).format("MMMM D, YYYY"); // e.g., "November 12, 2025"
   }
 
   function formatTime(timeString) {
     return moment(timeString, "HH:mm:ss").format("h:mma"); // e.g., "4:30pm"
   }

 return (
  <Box sx={{ display: 'flex', height: '100vh', padding: 2, gap: 2 }}>
    {/* Sidebar */}
    <Box sx={{ width: '220px', borderRight: '1px solid #ccc' }}>
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Vertical tabs"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
      >
        <Tab label="Events" onClick={() => setActiveTab(0)} />
        <Tab label="Students" onClick={() => setActiveTab(1)} />
        <Tab label="Create Event" component={NavLink} to="/createEvent" />
      </Tabs>
    </Box>

    {/* Main Content */}
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Box sx={{ width: '100%', maxWidth: '70%', px: 10 }}>
        {/* Events Tab */}
        {activeTab === 0 && (
  <Box className="eventCard" sx={{ width: '100%', mx: 'auto' }}>
    <Typography variant="h4" sx={{ mb: 5, mt: 5, pb: 1, borderBottom: '2px solid #3498db', fontWeight: 'bold' }}>
      Admin Event Management
    </Typography>
    <SearchEvent eventList={eventList} setEventList={setEventList} />

    {/* Table Head */}
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 4,
        py: 2,
        backgroundColor: '#3498db',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: '100%',
      }}
    >
      {['Title', 'Date', 'Time', 'School', 'Channel', 'Num Registered', 'Num Attended'].map((text, index) => (
        <Box
          key={index}
          sx={{
            flex: index === 0 ? 2 : 1,
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          {text}
        </Box>
      ))}
    </Paper>

    {/* Events */}
    {events.length > 0 ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {events.map((event, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 2,
              backgroundColor: '#fff',
              borderRadius: 0,
              width: '100%',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Accordion elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <AccordionSummary expandIcon={<IoIosArrowDropdown />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 2 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {event.title} {event.activity || "N/A"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'gray' }}>
                        {event.location || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1.2 }}>{formatDate(event.date)}</Box>
                  <Box sx={{ flex: 1.1 }}>{formatTime(event.time)}</Box>
                  <Box sx={{ flex: 1.1 }}>{event.school_name || "N/A"}</Box>
                  <Box sx={{ flex: 1.4 }}>{event.channel || "N/A"}</Box>
                  <Box sx={{ flex: 1 }}>{event.participants?.length || 0}</Box>
                  <Box sx={{ flex: .6 }}>
                    {event.participants?.filter(p => p.marked).length || 0}
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Divider sx={{ my: 2 }} />
                <AccordionActions sx={{ justifyContent: 'flex-end', px: 2 }}>
                  <NavLink
                    to={`/updateEvent/${event.id}`}
                    state={{ event }}
                  >
                    Update Event
                  </NavLink>
                </AccordionActions>

                <Typography variant="h6" sx={{ mb: 1, pl: 11 }}>
                  Participants
                </Typography>
                <List dense sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  pl: 11,
                  borderRadius: 1,
                }}>
                  {event.participants.map((participant, pIndex) => (
                    <ListItem key={pIndex} sx={{ mb: 2 }}>
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
          </Paper>
        ))}
      </Box>
    ) : (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        <Typography>No events available</Typography>
      </Box>
    )}
  </Box>
)}


        {/* Students Tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)', mt: 4 }}>
            <StudentsTab />
          </Paper>
        )}
      </Box>
    </Box>
  </Box>
);
};

export default AdminHome;