import axios from 'axios';
import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Tabs, Tab, Box,
  Button, Divider, List, ListItem, ListItemText, Paper, AccordionActions,
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import StudentsTab from '../StudentsTab/StudentsTab';
import DeleteEvent from '../DeleteEvent/DeleteEvent';
import AlterAdminRoles from '../AlterAdminRoles/AlterAdminRoles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchEvent from '../SearchEvent/SearchEvent.jsx';
import moment from 'moment'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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

  function formatDate(dateString) {
    return moment(dateString).format("MMMM D, YYYY"); // e.g., "November 12, 2025"
  }

  function formatTime(timeString) {
    return moment(timeString, "HH:mm:ss").format("h:mma"); // e.g., "4:30pm"
  }

  // Handle Delete Event
  const handleDeleteEvent = (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    
    if (confirmDelete) {
      axios.delete(`/api/events/${eventId}`)
        .then(() => {
          setEvents(events.filter(event => event.id !== eventId)); // Remove event from state
          console.log('Event deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting event', error);
        });
    }
  };

  return (
<>
<Box sx={{ display: 'flex', height: '100vh', padding: 2 }}>
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
          <Tab label="Alter admin" onClick={() => setActiveTab(2)} />
          <Tab label="Create Event" component={NavLink} to="/createEvent" />
        </Tabs>
      </Box>

    {/* Main Content */}
    <Box sx={{ flexGrow: 1, pl: 3 }}>

      {/* Events Tab */}
      {activeTab === 0 && (
       <Box className="eventCard" sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 2, mt: 5, fontWeight: 'bold' }}>
          Super admin Managment
        </Typography>
       <SearchEvent eventList={eventList} setEventList={setEventList} />  
          {/* Header */}
          <Paper
  elevation={1}
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 3,
    py: 2,
    backgroundColor: '#3498db', // Same blue as your table head
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxWidth: '1400px',
    margin: '0 auto',
  }}
>
  {['Title', 'Date', 'Time', 'School', 'Channel', 'Num Registered', 'Num Attended'].map((text, index) => (
    <Box
      key={index}
      sx={{
        flex: index === 0 ? 2 : 1, // wider space for Title
        color: 'white',
        fontWeight: 600,
        fontSize: '1rem',
      }}
    >
      {text}
    </Box>
  ))}
</Paper>

          {/* Events List */}
          {events.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mt: 0 }}>
              {events.map((event, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2,
                    backgroundColor: '#fff',
                    borderRadius: 0,
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
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
        <LocationOnIcon sx={{ color: 'red', fontSize: '1rem', mr: 0.5 }} />
        <Typography variant="body2">{event.location || "N/A"}</Typography>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <NavLink
                            to={`/updateEvent/${event.id}`}
                            state={{ event }}
                            className="update-event-link"
                          >
                            Update Event
                          </NavLink>
                          <IconButton
                            color="error"
                            aria-label="delete event"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
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
            <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px', // or adjust to fit your layout
    }}
  >
    <Typography>No events available</Typography>
  </Box>
          )}
        </Box>
      )}

      {/* Students Tab */}
      {activeTab === 1 && <StudentsTab />}

      {/* Alter Admin Tab */}
      {activeTab === 2 && <AlterAdminRoles />}
    </Box>
  </Box>
</>
  );
}

export default SuperAdminHome;
