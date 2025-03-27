import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios'

function HomePage() {
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
      url: "/api/events"
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
  // function to assign users to open roles/positions
  const assignRole = (event, roleColumn) => {
    if (!event || !event.id) {
      console.error("Invalid event data:", event);
      return;
    }
  // Check if role is already taken and Alert user that role is filled
  // if (event[roleColumn]) {
  //   alert(`This ${roleColumn.replace('_', ' ')} role is already assigned to user ${event[roleColumn].name}`);
  //   return;
  // }
    console.log('Attempting to assign role:', {
      eventId: event.id,
      roleColumn,
      userId: user.id
    });

    axios.put('/api/events/assign', {
      eventId: event.id,
      roleColumn,
      userId: user.id
    })
      .then(response => {
        console.log('Sending:', {
          eventId: event.id,
          roleColumn,
          userId: user.id
        });
        console.log(`Assigned ${user.id} as ${roleColumn} for event ${event.id}`);
        // Update state with the returned event
        setEventList(prevEvents =>
          prevEvents.map(prevEvent =>
            prevEvent.id === response.data.id ? response.data : prevEvent
          ));
          fetchEvent();
      })
      .catch(error => {
        console.error("Error assigning role:", error);
      });
  }

  useEffect(() => {
    fetchEvent();
  }, []);
  return (
    <>
      <h2>LMR STUDENT HOME PAGE</h2>
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
            <div key={index}>
              <Box sx={{ minWidth: 275, mb: 2 }} >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {event.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                      Date: {event.date} - Time of Event: {event.time} <br /> Streaming Channel: {event.channel}
                    </Typography>
                    <Typography variant="h7" component="div">
                      Schools: {event.school_name} vs [Opponent Name]
                    </Typography>
                    <Typography variant="h7" component="div">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="body2">
                      <br />
                      Notes: {event.notes}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => assignRole(event, "producer")}
                      disabled={!!event.producer}
                    >
                      Producer: {event.producer_username || "(Unassigned)"}
                    </Button>
                    <Button 
                    size="small" 
                    onClick={() => assignRole(event, "camera")}
                    disabled={!!event.camera}
                    >
                      Camera: {event.camera_username || "(Unassigned)"}
                    </Button>
                    <Button 
                    size="small" 
                    onClick={() => assignRole(event, "play_by_play")}
                    disabled={!!event.play_by_play}
                    >
                      Play-by-play: {event.play_by_play_username || "(Unassigned)" }
                    </Button>
                    <Button size='small'
                    onClick={() => assignRole(event, "color_commentator")}
                    disabled={!!event.color_commentator}
                    >
                      Color Commentator: {event.color_commentator_username || "(Unassigned)"}
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </div>
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

export default HomePage;
