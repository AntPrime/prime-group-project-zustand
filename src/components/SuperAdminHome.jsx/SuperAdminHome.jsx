import axios from 'axios';
import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Tabs, Tab, Box,
  Button, Divider, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import StudentsTab from '../StudentsTab/StudentsTab';
import DeleteEvent from '../DeleteEvent/DeleteEvent';
import AlterAdminRoles from '../AlterAdminRoles/AlterAdminRoles';
import SearchEvent from '../SearchEvent/SearchEvent';


function SuperAdminHome() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

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
    const apiRole = ROLE_MAPPING[role.toLowerCase()];
    axios.put(`/api/events/attended/${eventId}`, { role: apiRole })
      .then(() => {
        console.log('Successfully toggled attendance');
        fetchEvent();
      })
      .catch((error) => {
        console.log('Error updating attendance', error);
      });
  };

  const fetchEvent = () => {
    axios.get("/api/events/all")
      .then((response) => {
        setEventList(response.data);
      })
      .catch((err) => {
        console.error("GET /api/events/all error:", err);
      });
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <h2>LMR SUPER ADMIN HOME PAGE</h2>
      
      {/* Tabs for different sections */}

    <Box sx={{ display: 'flex', height: '100vh', padding: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: '220px', pr: 3, borderRight: '1px solid #ccc' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>SUPER ADMIN</Typography>
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Vertical tabs"
        >
          <Tab label="Events" onClick={() => setActiveTab(0)} />
          <Tab label="Students" onClick={() => setActiveTab(1)} />
          <Tab label="Assign Admin" onClick={() => setActiveTab(2)} />

        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, pl: 3 }}>
        <Typography variant="h4" gutterBottom sx={{
          color: '#2c3e50',
          fontWeight: '600',
          mb: 4
        }}>LMR SUPER ADMIN HOME PAGE</Typography>
  
        {/* Conditionally Render Events Tab */}
        {activeTab === 0 && (
          <Paper sx={{ 
            p: 3, 
            borderRadius: '12px',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }}>
          <Box className='eventCard'>
            {events.length > 0 ? (
              events.map((event, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    backgroundColor: event.isMarked ? 'lightgreen' : 'inherit',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <AccordionSummary expandIcon={<IoIosArrowDropdown />}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {event.title} {event.isMarked && ' ✓'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {event.date} | Time: {event.time} | Channel: {event.channel}
                      </Typography>
                      <Typography variant="body2">
                        Schools: {event.school_name} vs [Opponent Name] | Location: {event.location}
                      </Typography>
                    </Box>
                  </AccordionSummary>


                  <NavLink to={`/updateEvent/${event.id}`} state={{ event }} style={{ textDecoration: 'none' }}>
                    <Button variant="contained">Update Event</Button>
                  </NavLink>

                  <Box  sx={{ backgroundColor: 'red', display: 'inline-block', float: 'right', mt: 2  }}>
                    <DeleteEvent eventId={event.id} variant="contained" />
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
          </Box>
          </Paper>
        )}

        {/* Conditionally Render Students Tab */}
        {activeTab === 1 && <StudentsTab />}
        {activeTab === 2 && <AlterAdminRoles />}
      </Box>
      
    </Box>
    </>
  );
  
}

export default SuperAdminHome;
