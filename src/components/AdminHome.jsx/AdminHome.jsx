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

  const handleParticipantmarked = (eventIndex, userId) => {
    setEvents(prev => prev.map((event, idx) => {
      if (idx !== eventIndex) return event;
      return {
        ...event,
        participants: event.participants.map(p =>
          p.userId === userId ? { ...p, isMarked: !p.isMarked } : p
        )
      };
    }));
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
    console.log(eventList)
    setEvents(eventList.map(event => ({
      ...event,
      participants: [
        {
          role: 'Play-by-Play',
          userId: event.play_by_play,
          username: event.play_by_play_username,
          marked: event.payments?.[event.play_by_play]?.marked || false
        },
        {
          role: 'Color Commentator',
          userId: event.color_commentator,
          username: event.color_commentator_username,
          marked: event.payments?.[event.color_commentator]?.marked || false
        },
        {
          role: 'Camera',
          userId: event.camera,
          username: event.camera_username,
          marked: event.payments?.[event.camera]?.marked || false
        },
        {
          role: 'Producer',
          userId: event.producer,
          username: event.producer_username,
          marked: event.payments?.[event.producer]?.marked || false
        }
      ].filter(p => p.userId)
    })));
  }, [eventList]);
  return (
    <>
      <h2>LMR SUPER ADMIN HOME PAGE</h2>
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
                          color={participant.isMarked ? 'success' : 'primary'}
                          onClick={() => handleParticipantmarked(index, participant.userId)}
                        >
                          {participant.isMarked ? 'Attended ✓' : 'Signed Up'}
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

      <h5></h5>
      <p>Your ID is: {user.id}</p>
      <button onClick={logOut}>Log Out</button>
    </>
  );
}

export default AdminHome;