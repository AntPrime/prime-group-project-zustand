import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import {
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import StudentsTab from '../StudentsTab/StudentsTab';

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
  const [activeTab, setActiveTab] = useState(0);

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
  // Sorting function
  const sortEvents = (criteria, event) => {
    event.preventDefault();

    let sortedEvents = [...eventList];
    let newOrder = sortOrder[criteria] === "asc" ? "desc" : "asc"; // Toggle order

    if (criteria === "date") {
      sortedEvents.sort((a, b) =>
        newOrder === "asc"
          ? new Date(a.date) - new Date(b.date) // Soonest first
          : new Date(b.date) - new Date(a.date) // Latest first
      );
    } else if (criteria === "location") {
      sortedEvents.sort((a, b) =>
        newOrder === "asc"
          ? a.location.localeCompare(b.location) // A-Z
          : b.location.localeCompare(a.location) // Z-A
      );
    }

    setSortOrder((prev) => ({ ...prev, [criteria]: newOrder })); // Update sorting order
    setSortBy(criteria);
    setEventList(sortedEvents);
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

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <>
    <h2>LMR ADMIN HOME PAGE</h2>
    
    {/* Tabs Section */}
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Events" />
          <Tab label="Students" />
        </Tabs>
      </Box>

      {/* Events Tab */}
      <TabPanel value={activeTab} index={0}>
        <input placeholder='Search Event' />
        <div>
          <button onClick={(e) => sortEvents("date", e)}>
            Date {sortOrder.date === "asc" ? "↑" : "↓"}
          </button>
          <button onClick={(e) => sortEvents("location", e)}>
            Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}
          </button>
          <select>
            <option value="">Category</option>
          </select>
          <select>
            <option value="">School</option>
          </select>
          <button>Search</button>
          <button>Clear All</button>
        </div>

        <h4>Filter Applied: {sortBy ? `Sorted by ${sortBy}` : "No sorting applied"}</h4>
        
        <div className='eventCard'>
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

                <AccordionDetails>
                  <NavLink to={`/updateEvent/${event.id}`} state={{ event }} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ mb: 2 }}>
                      Update Event
                    </Button>
                  </NavLink>

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Assigned Roles ({event.participants.length})
                  </Typography>

                  {/* Participant List */}
                  <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {event.participants.map((participant, pIndex) => (
                      <ListItem
                        key={pIndex}
                        sx={{
                          backgroundColor: participant.marked ? 'lightgreen' : 'inherit',
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
      </TabPanel>

      {/* Students Tab */}
      <TabPanel value={activeTab} index={1}>
        <StudentsTab />
      </TabPanel>
    </Box>

    <h5></h5>
    <p>Your ID is: {user.id}</p>
    <button onClick={logOut}>Log Out</button>
  </>
)};

export default AdminHome;