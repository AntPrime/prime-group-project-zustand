import useStore from '../../zustand/store' 
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox } from '@mui/material';
import axios from 'axios';

function SearchEvent({ eventList, setEventList }) {
  const fetchEvents = useStore((state) => state.fetchEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState('');
// Multi-select states
const [sortBy, setSortBy] = useState(null);
const [selectedSchools, setSelectedSchools] = useState([]);
const [selectedActivities, setSelectedActivities] = useState([]);
const [selectedChannels, setSelectedChannels] = useState([]);
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
  
  const [channels, setChannels] = useState([
    { id: 1, name: 'ZTV' },
    { id: 2, name: 'LeafsTv' },
    { id: 3, name: 'ERTv' },
    { id: 4, name: 'RogersTv' },
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);
  

    // // GET fetchEventList 
    // function fetchEventList() {
    //   console.log( 'in fetchEventList' );
    //   axios.get( '/api/events/all' ).then(function( response ){
    //     console.log( response.data )
    //     setEventList( response.data ) 
    //   }).catch( function( err ){
    //         console.log( err );
    //         alert( 'error getting test list' );
    //       })
    // }

   // GET Search
    function searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels) {
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
        filterEvents(searchResults, selectedSchools, selectedActivities, selectedChannels);
      })
    }
  // Filter events selected
  function filterEvents(searchResults, selectedSchools, selectedActivities, selectedChannels) {
    axios.get('/api/events/all').then((fullResponse) => {
      const allEvents = fullResponse.data || [];
      
      const filteredEvents = allEvents.filter(event => {
        const eventMatchesSearch = searchResults.some(result => result.title === event.title);
        const eventMatchesSchool = selectedSchools.length === 0 || selectedSchools.includes(event.school_name);
        const eventMatchesActivity = selectedActivities.length === 0 || selectedActivities.includes(event.activity);
        const eventMatchesChannel = selectedChannels.length === 0 || selectedChannels.includes(event.channel);
        return eventMatchesSearch && eventMatchesSchool && eventMatchesActivity && eventMatchesChannel;
      });
  
      // Sort filteredEvents based on sortBy and sortOrder
      if (sortBy === 'date') {
        filteredEvents.sort((a, b) =>
          sortOrder.date === 'asc'
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
        );
      } else if (sortBy === 'location') {
        filteredEvents.sort((a, b) =>
          sortOrder.location === 'asc'
            ? a.location.localeCompare(b.location)
            : b.location.localeCompare(a.location)
        );
      }
  
      setSearchResults(filteredEvents);
      setEventList(filteredEvents);
    })
    .catch((error) => {
      console.error("Error fetching all events:", error);
    });
  }    

  function handleSearch() {
    let appliedFilterText = [];
    if (searchQuery) {
      appliedFilterText.push(`SEARCH ${searchQuery}`);
    }
    if (selectedSchools.length > 0) {
      appliedFilterText.push(`SCHOOL ${selectedSchools.join(', ')}`);
    }
    if (selectedActivities.length > 0) {
      appliedFilterText.push(`ACTIVITY ${selectedActivities.join(', ')}`);
    }
    if (selectedChannels.length > 0) {
      appliedFilterText.push(`CHANNEL ${selectedChannels.join(', ')}`);
    }
    // Add sorting filter text for date and location
    if (sortBy && sortOrder[sortBy]) {
      if (sortBy === 'date') {
        appliedFilterText.push(`DATE ${sortOrder.date}`);
      } else if (sortBy === 'location') {
        appliedFilterText.push(`LOCATION ${sortOrder.location}`);
      }
    }
    // If no filters or sorting are applied, display "No sorting applied"
    setAppliedFilters(appliedFilterText.length > 0 ? appliedFilterText.join(' | ') : 'No sorting applied');
    // Trigger search with current filters
    searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels);
  }

  function handleMultiSelectChange(event, type) {
    const selectedOptions = event.target.value;
    if (type === "schools") {
      setSelectedSchools(selectedOptions);
    }
    else if (type === "channels") {
      setSelectedChannels(selectedOptions);
    } 
    else if (type === "activities") {
      setSelectedActivities(selectedOptions);
    }
    // After updating the selection, trigger handleSearch to update filter text and search results
    handleSearch();
  }

      const handleSort = (sortBy) => {
        let newSortOrder = 'asc'; // default sort order
      
        // Toggle the sort order (asc -> desc -> asc)
        if (sortBy === 'date') {
          newSortOrder = sortOrder.date === 'asc' ? 'desc' : 'asc';
          setSortBy('date');
          setSortOrder((prev) => ({ ...prev, date: newSortOrder }));
        } else if (sortBy === 'location') {
          newSortOrder = sortOrder.location === 'asc' ? 'desc' : 'asc';
          setSortBy('location');
          setSortOrder((prev) => ({ ...prev, location: newSortOrder }));
        }
        // After updating sort state, trigger handleSearch to update the applied filters text and search results
        handleSearch();
      };
      

    // // Sorting function
    // const sortEvents = (criteria, event) => {
    //   event.preventDefault();
    //   let sortedEvents = [...eventList];
    //   let newOrder = sortOrder[criteria] === "asc" ? "desc" : "asc"; // Toggle order
    //   if (criteria === "date") {
    //     sortedEvents.sort((a, b) => 
    //       newOrder === "asc" 
    //         ? new Date(a.date) - new Date(b.date) // Soonest first
    //         : new Date(b.date) - new Date(a.date) // Latest first
    //     );
    //   } else if (criteria === "location") {
    //     sortedEvents.sort((a, b) =>
    //       newOrder === "asc"
    //         ? a.location.localeCompare(b.location) // A-Z
    //         : b.location.localeCompare(a.location) // Z-A
    //     );
    //   }
    //   setSortOrder((prev) => ({ ...prev, [criteria]: newOrder })); // Update sorting order
    //   setSortBy(criteria);
    //   setEventList(sortedEvents);
    // };

    const handleClearAll = () => {
      // Reset all filters and sorting
      setSelectedSchools([]);
      setSelectedActivities([]);
      setSelectedChannels([]);
      setSearchQuery("");
      setSearchResults([]);
      setSortBy(null); // Reset sorting
      setSortOrder({ date: "asc", location: "asc" }); // Reset sort order
      setAppliedFilters('Clear all');

      // Clear event list and refetch
      setEventList([]); // Clear DOM display
      fetchEvents();    // Re-populate with all events
};
      

    return (
      <>
      <div>
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
          
          <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Channels</InputLabel>
            <Select
              multiple
              value={selectedChannels}
              onChange={(e) => handleMultiSelectChange(e, "channels")}
              renderValue={(selected) => selected.join(', ')}
              sx={{ overflow: 'hidden' }}
            >
              {channels.map((channel) => (
                <MenuItem key={channel.id} value={channel.name}>
                  <Checkbox checked={selectedChannels.indexOf(channel.name) > -1} />
                  <ListItemText primary={channel.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => handleSort("date")}>
            Date {sortOrder.date === "asc" ? "↑" : "↓"}
          </Button>
          <Button variant="contained" onClick={() => handleSort("location")}>
            Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}
          </Button>

          <Button variant="contained" onClick={handleSearch}>Search</Button>
          <Button variant="outlined" onClick={handleClearAll}>Clear All</Button>

        </Box>
      </Box>
      <h4>Filters Applied: {appliedFilters}</h4>

    </div>
    </>
  );
}

export default SearchEvent;