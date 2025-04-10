import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Tabs, Tab, Box,
  Button, Divider, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import SearchEvent from '../SearchEvent/SearchEvent.jsx';
import axios from 'axios';
import StudentsTab from '../StudentsTab/StudentsTab';


function AdminHome() {
 const user = useStore((state) => state.user);
 const logOut = useStore((state) => state.logOut);
 const [eventList, setEventList] = useState([]);
 const [activeTab, setActiveTab] = useState(0);
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
  return (
    <Box sx={{ display: 'flex', height: '100vh', padding: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: '220px', pr: 3, borderRight: '1px solid #ccc' }}>
  <Typography variant="h6" sx={{ 
    mb: 2, 
    fontWeight: '600',
    color: '#2c3e50', // Added color to match SuperAdmin
    pl: 1 // Adjusted padding to match
  }}>
    ADMIN DASHBOARD
  </Typography>
  <Tabs
    orientation="vertical"
    value={activeTab}
    onChange={handleTabChange}
    sx={{ width: '220px', pr: 3, borderRight: '1px solid #ccc' }}
  >
    <Tab label="Events" />
    <Tab label="Students" />
  </Tabs>
</Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, pl: 3 }}>
        <Typography variant="h4" gutterBottom sx={{
          color: '#2c3e50',
          fontWeight: '600',
          mb: 4
        }}>
          Event Management Console
        </Typography>
        <SearchEvent/>
        {/* Events Tab */}
        {activeTab === 0 && (
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }}>
            <div className='eventCard'>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      mb: 2,
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <AccordionSummary expandIcon={<IoIosArrowDropdown />}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {event.date} | Time: {event.time}
                        </Typography>
                        <Typography variant="body2">
                          Location: {event.location}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Assigned Roles ({event.participants?.length || 0})
                      </Typography>

                      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {event.participants?.map((participant, pIndex) => (
                          <ListItem
                            key={pIndex}
                            sx={{
                              mb: 1,
                              borderRadius: 1,
                              backgroundColor: '#f8f9fa'
                            }}
                          >
                            <ListItemText
                              primary={participant.username}
                              secondary={`Role: ${participant.role}`}
                            />
                            <Box sx={{ ml: 'auto' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                color={participant.marked ? 'success' : 'primary'}
                                onClick={() => handleParticipantmarked(event.id, participant.role)}
                              >
                                {participant.marked ? 'Attended ✓' : 'Mark Attendance'}
                              </Button>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No upcoming events
                </Typography>
              )}
            </div>
          </Paper>
        )}

        {/* Students Tab */}
        {activeTab === 1 && (
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }}>
            <StudentsTab />
          </Paper>
        )}
      </Box>
    </Box>
  );
}



export default AdminHome;
