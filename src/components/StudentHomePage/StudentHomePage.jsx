import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import { Box, Card, CardActions, CardContent, Button, Typography } from "@mui/material";
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios'

function StudentHomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const fetchEvents = useStore((state) => state.fetchEvents)

  const [eventList, setEventList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
// Multi-select states
const [sortBy, setSortBy] = useState(null);
const [selectedSchools, setSelectedSchools] = useState([]);
const [selectedActivities, setSelectedActivities] = useState([]);
const [sortOrder, setSortOrder] = useState({ date: "asc", location: "asc"});

  const [schools, setSchools] = useState([
    { id: 1, name: 'Albert Lea' },
    { id: 2, name: 'Fairbault' },
    { id: 3, name: 'Northfield' },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, name: 'Basketball' },
    { id: 2, name: 'Tennis' },
    { id: 3, name: 'Football' },
    { id: 4, name: 'Lacrosse' },
    { id: 5, name: 'Hockey' },
  ]);
  

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

   // GET Search
    function searchEvents(searchQuery, selectedSchools, selectedActivities) {
      axios.get(`/api/events?q=${searchQuery}`).then((searchResponse) => {
        const searchResults = searchResponse.data || [];
        console.log("Search response:", searchResults);
        // No Search results
        if (!searchResults.length) {
          console.log("No results searched");
          setSearchResults([]);
          setEventList([]);
          return;
        }
        filterEvents(searchResults, selectedSchools, selectedActivities);
      })
    }
  // Filter events selected
    function filterEvents(searchResults, selectedSchools, selectedActivities) {
      axios.get('/api/events/all').then((fullResponse) => {
          const allEvents = fullResponse.data || [];
          console.log("All Events:", allEvents);
          // Filter events based on search, schools, and activities
          const filteredEvents = allEvents.filter(event => {
            const eventMatchesSearch = searchResults.some(result => result.title === event.title);
            const eventMatchesSchool = selectedSchools.length === 0 || selectedSchools.includes(event.school_name);
            const eventMatchesActivity = selectedActivities.length === 0 || selectedActivities.includes(event.activity);
            return eventMatchesSearch && eventMatchesSchool && eventMatchesActivity;
          });
          console.log("Filtered events:", filteredEvents);
          setSearchResults(filteredEvents);
          setEventList(filteredEvents);
        })
        .catch((error) => {
          console.error("Error fetching all events:", error);
        });
    }

  // Search Dropdown Handle 
  function handleSearch() {
    searchEvents(searchQuery, selectedSchools, selectedActivities);
  }

   // Search MultiDropdown Handle 
  function handleMultiSelectChange(event, type) {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    if (type === "schools") {
      setSelectedSchools(selectedOptions);
    } else if (type === "activities") {
      setSelectedActivities(selectedOptions);
    }
  }

    // PUT Assign user role
    function assignRoles(event, roleColumn) {
      console.log('Assign user to role:', { eventId: event.id, roleColumn: roleColumn });
      axios.put( '/api/assignRole/assignRole', {
        eventId: event.id,
        roleColumn,
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

    function formatDate(dateString) {
      return moment(dateString).format("MM/DD/YYYY"); // Example: 03/30/2025
    }

    function formatTime(timeString) {
      return moment(timeString, "HH:mm:ss").format("h:mm A"); // Example: 3:30 PM
    }


    return (
      <>
        <div>
          <h2>LMR STUDENT HOME PAGE</h2>
          <div>
            <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            <button onClick={(e) => sortEvents("date", e)}> Date {sortOrder.date === "asc" ? "↑" : "↓"}</button>
            <button onClick={(e) => sortEvents("location", e)}>Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}</button>
            <select id="activities" multiple value={selectedActivities} onChange={(e) => handleMultiSelectChange(e, "activities")}>
            {activities.map((activity) => (<option key={activity.id} value={activity.name}>{activity.name}</option>))}</select>
            <select id="schools" multiple value={selectedSchools} onChange={(e) => handleMultiSelectChange(e, "schools")}>
              {schools.map((school) => (<option key={school.id} value={school.name}>{school.name}</option>))}</select>
            <button onClick={handleSearch}>Search</button>
            <button onClick={() => { 
              setSelectedSchools([]); 
              setSelectedActivities([]); 
              setSearchQuery(""); 
              setSearchResults([]); 
              fetchEventList(); // Refresh the event list
            }}>
              Clear All
            </button>
          </div>
        </div>
  
        <h4>Filter Applied: {sortBy ? `Sorted by ${sortBy}` : "No sorting applied"}</h4>
  
        <div className='eventCard'>
          {eventList.length > 0 ? (
            eventList.map((event, index) => {
              return (
                <div key={index}>
                  <Box sx={{ minWidth: 275, mb: 2 }} >
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {event.title}
                        </Typography>
                      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                          Created by: {event.created_by_id} <br />
                          Date: {formatDate(event.date)} <br />
                          Time: {formatTime(event.start_time)} - {formatTime(event.end_time)} <br />
                          Streaming Channel: {event.channel}
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
                        <Button size="small" onClick={() => assignRoles(event, "producer")} disabled={!!event.producer}>
                          Producer: {event.producer_username || "(Unassigned)"}
                        </Button>
                        <Button size="small" onClick={() => assignRoles(event, "camera")} disabled={!!event.camera}>
                          Camera: {event.camera_username || "(Unassigned)"}
                        </Button>
                        <Button size="small" onClick={() => assignRoles(event, "play_by_play")} disabled={!!event.play_by_play}>
                          Play-by-play: {event.play_by_play_username || "(Unassigned)"}
                        </Button>
                        <Button size="small" onClick={() => assignRoles(event, "color_commentator")} disabled={!!event.color_commentator}>
                          Color Commentator: {event.color_commentator_username || "(Unassigned)"}
                        </Button>
                        <NavLink to={`/updateEvent/${event.id}/${event.title}`} style={{ textDecoration: 'none' }} state={{ event }}>
                          <Button size="small">Edit Event</Button>
                        </NavLink>
                      </CardActions>
                    </Card>
                  </Box>
                </div>
              );
            })
          ) : (
            <h4>No events found</h4>
          )}
        </div>
      </>
    );
  }

export default StudentHomePage;

      // const Search = () => {
  //   console.log( "Fetching query:", searchQuery, selectedSchools, selectedActivities );
  //   axios.get(`/api/events?q=${searchQuery}`).then(( searchResponse ) => {
  //     const searchResults = searchResponse.data;
  //     console.log("searchResponse:", searchResults );
  //     // Search Input Apply
  //     if (!Array.isArray( searchResults )|| searchResults.length === 0 ) {
  //       console.log("No results searched");
  //       setSearchResults([]);
  //       setEventList([]);
  //       return;
  //     }
  //     const eventTitles = searchResults.map(event => event.title );
  //     console.log("Extracted Event Titles:", eventTitles );
  //     axios.get(`/api/events/all`).then((fullResponse)=> {
  //       const allEvents = fullResponse.data;
  //       console.log( "Full events:", allEvents );
  //       // Search Filter
  //       if (!Array.isArray(allEvents)) {
  //         console.log( "Invalid full events:");
  //         return;
  //       }
  //       const filteredEvents = allEvents.filter(event => eventTitles.includes(event.title));
  //       console.log("Filtered full event details:", filteredEvents);
  //       setSearchResults(filteredEvents);
  //       setEventList(filteredEvents);
  //     }).catch(error => console.error("Error fetching full event details:", error));
  //   })
  //   .catch(error => console.error("Error on GET", error));
  // };