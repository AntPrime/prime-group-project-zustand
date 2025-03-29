import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
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

  const Search = () => {
    console.log( "Fetching query:", searchQuery, selectedSchools, selectedActivities );
    axios.get(`/api/events?q=${searchQuery}`).then(( searchResponse ) => {
      const searchResults = searchResponse.data;
      console.log("searchResponse:", searchResults );
      // Search Input Apply
      if (!Array.isArray( searchResults )|| searchResults.length === 0 ) {
        console.log("No results searched");
        setSearchResults([]);
        setEventList([]);
        return;
      }
      const eventTitles = searchResults.map(event => event.title );
      console.log("Extracted Event Titles:", eventTitles );
      axios.get(`/api/events/all`).then((fullResponse)=> {
        const allEvents = fullResponse.data;
        console.log( "Full events:", allEvents );
        // Search Filter
        if (!Array.isArray(allEvents)) {
          console.log( "Invalid full events:");
          return;
        }
        const filteredEvents = allEvents.filter(event => eventTitles.includes(event.title));
        console.log("Filtered full event details:", filteredEvents);
        setSearchResults(filteredEvents);
        setEventList(filteredEvents);
      }).catch(error => console.error("Error fetching full event details:", error));
    })
    .catch(error => console.error("Error on GET", error));
  };

  function searchEvents(searchQuery, selectedSchools, selectedActivities) {
    console.log("Fetching query:", searchQuery, selectedSchools, selectedActivities);
    
    axios.get(`/api/events?q=${searchQuery}`).then((searchResponse) => {
      const searchResults = searchResponse.data;
      console.log("Search response:", searchResults);
  
      if (!Array.isArray(searchResults) || searchResults.length === 0) {
        console.log("No results searched");
        setSearchResults([]);
        setEventList([]);
        return;
      }
  
      // Extract event titles from search results
      const eventTitles = searchResults.map(event => event.title);
      console.log("Extracted Event Titles:", eventTitles);
  
      // Fetch all events and filter
      axios.get(`/api/events/all`).then((fullResponse) => {
        const allEvents = fullResponse.data;
        console.log("Full events:", allEvents);
  
        if (!Array.isArray(allEvents)) {
          console.log("Invalid full events");
          return;
        }
  
        // Apply school and activity filters if selected
        const filteredEvents = allEvents.filter(event => 
          eventTitles.includes(event.title) &&
          (selectedSchools.length === 0 || selectedSchools.includes(event.school_name)) &&
          (selectedActivities.length === 0 || selectedActivities.includes(event.activity))
        );
  
        console.log("Filtered full event details:", filteredEvents);
        setSearchResults(filteredEvents);
        setEventList(filteredEvents);
      }).catch(error => console.error("Error fetching full event details:", error));
  
    }).catch(error => console.error("Error on GET", error));
  }
  
  
  function handleSearch() {
    searchEvents(searchQuery, selectedSchools, selectedActivities);
  }
  
  function handleMultiSelectChange(event, type) {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    if (type === "schools") {
      setSelectedSchools(selectedOptions);
    } else if (type === "activities") {
      setSelectedActivities(selectedOptions);
    }
  }
  
  
  
    // PUT Assign user role
    function assignRole(event, roleColumn) {
      if (!event || !roleColumn) {
        console.error("Missing event or roleColumn");
        return;
      }
      console.log('Assign user to role:', { eventTitle: event.title, roleColumn, userId: user.id });
      axios.put( 'api/events/assign', {
        eventId: event.title,
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
        <p>Search Events</p>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={Search}>Search</button>
        <button onClick={handleSearch}>Search</button>

        <p>{JSON.stringify(searchResults)}</p>
        <div>
          <button onClick={(e) => sortEvents("date", e)}>
            Date {sortOrder.date === "asc" ? "↑" : "↓"}
          </button>
          <button onClick={(e) => sortEvents("location", e)}>
            Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}
          </button>
        
          <select id="activities" multiple value={selectedActivities} onChange={(e) => handleMultiSelectChange(e, "activities")}>
  {activities.map((activity) => (
    <option key={activity.id} value={activity.name}>{activity.name}</option>
  ))}
</select>

<select id="schools" multiple value={selectedSchools} onChange={(e) => handleMultiSelectChange(e, "schools")}>
  {schools.map((school) => (
    <option key={school.id} value={school.name}>{school.name}</option>
  ))}
</select>

          <button onClick={() => { 
            setSelectedSchools([]); 
            setSelectedActivities([]); 
            setSearchResults([]); 
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
                {/* Use NavLink to navigate to the updateEvent page */}
                <NavLink to={`/updateEvent/${event.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="small">
                    Update Event
                  </Button>
                </NavLink>
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

/// Working Search axios GET 
    // const Search = () => {
    //   console.log("Fetching query:", searchQuery);
    
    //   axios
    //     .get(`/api/events?q=${searchQuery}`)
    //     .then((response) => {
    //       console.log("Raw search response:", response.data); // Log raw search results
    
    //       if (!Array.isArray(response.data) || response.data.length === 0) {
    //         console.warn("Search API returned empty or non-array data.");
    //         return; // Stop execution if no results
    //       }
    
    //       // Extract titles instead of IDs
    //       const eventTitles = response.data.map(event => event.title);
    //       console.log("Extracted Event Titles:", eventTitles); // Debug titles
    
    //       // Fetch all event details
    //       axios
    //         .get('/api/events/all')
    //         .then(fullResponse => {
    //           console.log("Raw full events data:", fullResponse.data); // Log full event details
    
    //           if (!Array.isArray(fullResponse.data)) {
    //             console.warn("Full events API returned non-array data.");
    //             return;
    //           }
    
    //           // Filter full events using title instead of id
    //           const fullEvents = fullResponse.data.filter(event => eventTitles.includes(event.title));
    
    //           console.log("Filtered full event details:", fullEvents);
    
    //           if (fullEvents.length === 0) {
    //             console.warn("No matching full event details found.");
    //           }
    
    //           // Update state
    //           setSearchResults(fullEvents);
    //           setEventList(fullEvents);
    //         })
    //         .catch(error => console.log("Error fetching full event details:", error));
    //     })
    //     .catch(error => console.log("Error on GET", error));
    // };
    

    // const handleMultiSelectChange = (event, type) => {
    //   const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    //   if (type === "schools") {
    //     setSelectedSchools(selectedOptions);
    //   } else if (type === "activities") {
    //     setSelectedActivities(selectedOptions);
    //   }
    //   filterEvents(selectedOptions, type); // Auto-search on selection
    // };
  
    // const SearchFilter = () => {
    //   filterEvents([...selectedActivities], "activities");
    //   filterEvents([...selectedSchools], "schools");
    // };
  
    // const filterEvents = (selectedValues, type) => {
    //   let filteredResults = eventList;
  
    //   if (type === "activities" && selectedValues.length > 0) {
    //     filteredResults = filteredResults.filter(event =>
    //       selectedValues.some(activity => event.activity.includes(activity))
    //     );
    //   }
  
    //   if (type === "schools" && selectedValues.length > 0) {
    //     filteredResults = filteredResults.filter(event =>
    //       selectedValues.some(school => event.school_name.includes(school))
    //     );
    //   }
  
    //   setSearchResults(filteredResults);
    // };