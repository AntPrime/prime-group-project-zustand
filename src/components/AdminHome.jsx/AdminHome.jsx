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
import { IoIosArrowDropdown } from "react-icons/io";
import Button from '@mui/material/Button';

import axios from 'axios'

function AdminHome( ) {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState({
    date: "asc", // Default: Soonest first
    location: "asc", // Default: A-Z
  });

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
  {eventList.length > 0 ? (
    eventList.map((event, index) => (
      <Accordion key={index} sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<IoIosArrowDropdown />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
        >
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            {event.title} - {event.date} | {event.time}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Streaming Channel:</strong> {event.channel}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Schools:</strong> {event.school_name} vs [Opponent Name]
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Location:</strong> {event.location}
          </Typography>
          <Typography variant="body2">
            <strong>Notes:</strong> {event.notes}
          </Typography>
        </AccordionDetails>
        <AccordionActions>
          <Button>Sign User Up</Button>
          <Button>Remove User</Button>
        </AccordionActions>
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