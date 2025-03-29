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

function StudentHomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchEvents = useStore((state) => state.fetchEvents)
  const [sortOrder, setSortOrder] = useState({
    date: "asc", // Default: by most recent event
    location: "asc", // Default: location by A-Z
  });
  

  useEffect(()=> {
    fetchEvents()
    fetchEventList()
  }, [] );

    // GET fetchEventList 
    function fetchEventList() {
      console.log( 'in fetchEventList' );
      axios.get( '/api/events/all' ).then(function( response ){
        console.log( response.data )
        setEventList( response.data ) 
      }).catch( function( err ){
            console.log( err );
            alert( 'error getting test list' );
          })
    }
    const Search = () => {
      console.log("Fetching query:", searchQuery);
    
      axios
        .get(`/api/events?q=${searchQuery}`)
        .then((response) => {
          console.log("Raw search response:", response.data); // Log raw search results
    
          if (!Array.isArray(response.data) || response.data.length === 0) {
            console.warn("Search API returned empty or non-array data.");
            return; // Stop execution if no results
          }
    
          // Extract titles instead of IDs
          const eventTitles = response.data.map(event => event.title);
          console.log("Extracted Event Titles:", eventTitles); // Debug titles
    
          // Fetch all event details
          axios
            .get('/api/events/all')
            .then(fullResponse => {
              console.log("Raw full events data:", fullResponse.data); // Log full event details
    
              if (!Array.isArray(fullResponse.data)) {
                console.warn("Full events API returned non-array data.");
                return;
              }
    
              // Filter full events using title instead of id
              const fullEvents = fullResponse.data.filter(event => eventTitles.includes(event.title));
    
              console.log("Filtered full event details:", fullEvents);
    
              if (fullEvents.length === 0) {
                console.warn("No matching full event details found.");
              }
    
              // Update state
              setSearchResults(fullEvents);
              setEventList(fullEvents);
            })
            .catch(error => console.log("Error fetching full event details:", error));
        })
        .catch(error => console.log("Error on GET", error));
    };
    

    // PUT Assign user role
    function assignRole(event, roleColumn) {
      if (!event || !roleColumn) {
        console.error("Missing event or roleColumn");
        return;
      }
      console.log('Assign user to role:', { eventId: event.id, roleColumn, userId: user.id });
      axios.put( 'api/events/assign', {
        eventId: event.id,
        roleColumn: roleColumn,
        userId: user.id
      }).then(function(response){
        // setEventList(response.data);
        setEventList((prevEvents) =>
          prevEvents.map((prevEvent) =>
            prevEvent.id === response.data.id ? response.data : prevEvent ));
        fetchEventList();
      }).catch(function() {
        alert('Error assigning role');
      });
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

  return (
    <>
    <div>
      <h2>LMR STUDENT HOME PAGE</h2>
      {/* <input placeholder='Search Event' /> */}
      <p>Search Events</p>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={Search}>Search</button>
      <p>{JSON.stringify(searchResults)}</p>
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
        <button>Clear All</button>
        </div>
      </div>
      <h4>Filter Applied: {sortBy ? `Sorted by ${sortBy}` : "No sorting applied"}</h4>

      <div className='eventCard'>
  {eventList.length > 0 ? (
    eventList.map((event, index) => {
       // Log the entire event object to check its structure
      console.log(`Event ${index}:`, event);

      if (event && event.camera_username) {
        console.log(`Event ${event.id} - Camera Username:`, event.camera_username);
      } else {
        console.log(`Event ${index} is undefined or missing camera_username`);
      }
      
      return (
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
      );
    })
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

export default StudentHomePage;

  // const fetchEvent = () => {
  //   console.log("fetching..")

  //   axios({
  //     method: "GET",
  //     url: "/api/events/all"
  //   })
  //     .then((response) => {
  //       console.log("Response: ", response.data)
  //       // adding the DB contents into the empty array above
  //       setEventList(response.data)
  //     })
  //     .catch((err) => {
  //       console.log("GET /api/event is broken")
  //     })
  // }

    // // function to assign users to open roles/positions
  // const assignRole = (event, roleColumn) => {
  //   if (!event || !event.id) {
  //     console.error("Invalid event data:", event);
  //     return;
  //   }

  // Check if role is already taken and Alert user that role is filled
  // if (event[roleColumn]) {
  //   alert(`This ${roleColumn.replace('_', ' ')} role is already assigned to user ${event[roleColumn].name}`);
  //   return;
  // }

    // console.log('Attempting to assign role:', {
    //   eventId: event.id,
    //   roleColumn,
    //   userId: user.id
    // });

  //   axios.put('/api/events/assign', {
  //     eventId: event.id,
  //     roleColumn,
  //     userId: user.id
  //   })
  //     .then(response => {
  //       console.log('Sending:', {
  //         eventId: event.id,
  //         roleColumn,
  //         userId: user.id
  //       });
  //       console.log(`Assigned ${user.id} as ${roleColumn} for event ${event.id}`);
  //       // Update state with the returned event
  //       setEventList(prevEvents =>
  //         prevEvents.map(prevEvent =>
  //           prevEvent.id === response.data.id ? response.data : prevEvent
  //         ));
  //         // fetchEvent();
  //     })
  //     .catch(error => {
  //       console.error("Error assigning role:", error);
  //     });
  // }