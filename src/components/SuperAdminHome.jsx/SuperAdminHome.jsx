import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import axios from 'axios';

function SuperAdminHome() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState({
    date: "asc",
    location: "asc",
  });
  const [events, setEvents] = useState([]);

  // Payment handlers
  const handleMarkPaid = (index) => {
    setEvents(prev => prev.map((event, idx) => {
      if (idx !== index) return event;
      return { ...event, isPaid: !event.isPaid };
    }));
  };

  const handleParticipantPaid = (eventIndex, userId) => {
    setEvents(prev => prev.map((event, idx) => {
      if (idx !== eventIndex) return event;
      return {
        ...event,
        participants: event.participants.map(p => 
          p.userId === userId ? { ...p, isPaid: !p.isPaid } : p
        )
      };
    }));
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
    setEvents(eventList.map(event => ({
      ...event,
      isPaid: event.isPaid || false,
      participants: [
        { role: 'Play-by-Play', username: event.play_by_play_username, userId: event.play_by_play },
        { role: 'Color Commentator', username: event.color_commentator_username, userId: event.color_commentator },
        { role: 'Camera', username: event.camera_username, userId: event.camera },
        { role: 'Producer', username: event.producer_username, userId: event.producer }
      ].filter(p => p.username)
    })));
  }, [eventList]);

  // Sorting function
  const sortEvents = (criteria, event) => {
    event.preventDefault();
    let sortedEvents = [...eventList];
    const newOrder = sortOrder[criteria] === "asc" ? "desc" : "asc";

    if (criteria === "date") {
      sortedEvents.sort((a, b) => newOrder === "asc" 
        ? new Date(a.date) - new Date(b.date) 
        : new Date(b.date) - new Date(a.date));
    } else if (criteria === "location") {
      sortedEvents.sort((a, b) => newOrder === "asc" 
        ? a.location.localeCompare(b.location) 
        : b.location.localeCompare(a.location));
    }

    setSortOrder(prev => ({ ...prev, [criteria]: newOrder }));
    setSortBy(criteria);
    setEventList(sortedEvents);
  };

  return (
    <>
      <h2>LMR SUPER ADMIN HOME PAGE</h2>
      {/* Search/filter UI remains same */}

      <div className='eventCard'>
        {events.length > 0 ? (
          events.map((event, index) => ( // Changed from eventList to events
            <Accordion
              key={index}
              sx={{
                mb: 2,
                backgroundColor: event.isPaid ? 'lightgreen' : 'inherit',
                transition: 'background-color 0.3s ease'
              }}
            >
              <AccordionSummary expandIcon={<IoIosArrowDropdown />}>
                <div style={{ width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {event.title} {event.isPaid && ' ✓'}
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
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Assigned Roles ({event.participants.length})
                </Typography>

                <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {event.participants.map((participant, pIndex) => (
                    <ListItem
                      key={participant.userId || pIndex}
                      sx={{
                        backgroundColor: participant.isPaid ? 'lightgreen' : 'inherit',
                        transition: 'background-color 0.3s ease',
                        mb: 1,
                        borderRadius: 1
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
                          color={participant.isPaid ? 'success' : 'primary'}
                          onClick={() => handleParticipantPaid(index, participant.userId)}
                        >
                          {participant.isPaid ? 'Paid ✓' : 'Mark Paid'}
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant="contained"
                  color={event.isPaid ? 'success' : 'primary'}
                  onClick={() => handleMarkPaid(index)}
                  sx={{ mt: 2 }}
                >
                  {event.isPaid ? 'Mark Event Unpaid' : 'Mark Entire Event Paid'}
                </Button>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
      <h5></h5>
      <p>Your ID is: {user.id}</p>
      <button onClick={logOut}>Log Out</button>
    </>
  );
}
export default SuperAdminHome;