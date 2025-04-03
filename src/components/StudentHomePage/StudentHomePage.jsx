import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Chip, ListItemText, Checkbox } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { IoIosArrowDropdown } from "react-icons/io";
import moment from 'moment';
import axios from 'axios';
import DeleteEvent from '../DeleteEvent/DeleteEvent';

function StudentHomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const fetchEvents = useStore((state) => state.fetchEvents)

  const [eventList, setEventList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState('');
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
    // fetchEvents()
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
    // Track applied filters
    let appliedFilterText = '';
    if (searchQuery) {
      appliedFilterText += `SEARCH ${searchQuery} `;
    }
    if (selectedSchools.length > 0) {
      appliedFilterText += `SCHOOL ${selectedSchools.join(', ')} `;
    }
    if (selectedActivities.length > 0) {
      appliedFilterText += `ACTIVITY ${selectedActivities.join(', ')} `;
    }
    else {
      appliedFilterText += 'No sorting applied';
    }
    setAppliedFilters(appliedFilterText); // Set the filter message
    searchEvents(searchQuery, selectedSchools, selectedActivities);
  }

   // Search MultiDropdown Handle 
  function handleMultiSelectChange(event, type) {
    const selectedOptions = event.target.value;
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {/* First Row: Search Input, Schools, Activities, Sorting, and Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 200, minWidth: 120 }}
          />
          <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Schools</InputLabel>
            <Select
              multiple
              value={selectedSchools}
              onChange={(e) => handleMultiSelectChange(e, "schools")}
              renderValue={(selected) => selected.join(', ')}
              sx={{ overflow: 'hidden' }}
            >
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.name}>
                  <Checkbox checked={selectedSchools.indexOf(school.name) > -1} />
                  <ListItemText primary={school.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Activities</InputLabel>
            <Select
              multiple
              value={selectedActivities}
              onChange={(e) => handleMultiSelectChange(e, "activities")}
              renderValue={(selected) => selected.join(', ')}
              sx={{ overflow: 'hidden' }}
            >
              {activities.map((activity) => (
                <MenuItem key={activity.id} value={activity.name}>
                  <Checkbox checked={selectedActivities.indexOf(activity.name) > -1} />
                  <ListItemText primary={activity.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={(e) => sortEvents("date", e)}>
            Date {sortOrder.date === "asc" ? "↑" : "↓"}
          </Button>
          <Button variant="contained" onClick={(e) => sortEvents("location", e)}>
            Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}
          </Button>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedSchools([]);
              setSelectedActivities([]);
              setSearchQuery("");
              setSearchResults([]);
              setAppliedFilters('');  // Clear the applied filter text
              fetchEventList();
            }}
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </div>

    <h4>Filter Applied: {appliedFilters} {sortBy ? `Sorted by ${sortBy}` : "No sorting applied"}</h4>
    {/* <h4>Filter Applied: {sortBy ? `Sorted by ${sortBy}` : "No sorting applied"}</h4> */}
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
                  <strong>Created by:</strong> {event.created_by_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {formatDate(event.date)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Time:</strong> {formatTime(event.time)} 
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Streaming Channel:</strong> {event.channel}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Schools:</strong> {event.school_name} vs {event.opponent_name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {event.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Notes:</strong> {event.notes}
                </Typography>
              </AccordionDetails>
              <AccordionActions>
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
              </AccordionActions>
            </Accordion>
          ))
        ) : (
          <h4>No events found</h4>
        )}
      </div>
    </>
  );
}


export default StudentHomePage;

//                 {/* Use NavLink to navigate to the updateEvent page */}
//                 <NavLink 
//   to={`/updateEvent/${event.id}/${event.title}`} 
//   style={{ textDecoration: 'none' }} 
//   state={{ event }}
// >
//   <Button size="small">
//     Update Event
//   </Button>
// </NavLink>


