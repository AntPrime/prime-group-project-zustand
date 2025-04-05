import useStore from '../../zustand/store' 
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox } from '@mui/material';
import axios from 'axios';

function SearchEvent({ eventList, setEventList }) {
  const fetchEvents = useStore((state) => state.fetchEvents);
  const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
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

  // useEffect(() => {
  //   fetchEvents(); // This might fetch all events initially
  // }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
    if (sortBy) {
      handleSearch();
    }
  }, [fetchEvents, sortBy, sortOrder]);  

  function handleSearch() {
    searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels);
  }

   // GET Search
   function searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels) {
    axios.get(`/api/events?q=${searchQuery}`).then((searchResponse) => {
      const searchResults = searchResponse.data || [];
      filterEvents(searchResults, selectedSchools, selectedActivities, selectedChannels);
    });
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
      // setSearchResults(filteredEvents);
      setEventList(filteredEvents);
    })
    .catch((error) => {
      console.error("Error fetching all events:", error);
    });
  }    
  
  function handleMultiSelectChange(event, type) {
    const selectedOptions = event.target.value;
    if (type === "schools") {
      setSelectedSchools(selectedOptions);
    } else if (type === "channels") {
      setSelectedChannels(selectedOptions);
    } else if (type === "activities") {
      setSelectedActivities(selectedOptions);
    }
  }

  const handleSort = (criteria) => {
    const newSortOrderValue = sortOrder[criteria] === 'asc' ? 'desc' : 'asc';
    setSortBy(criteria);
    setSortOrder((prev) => ({
      ...prev,
      [criteria]: newSortOrderValue,
    }));
  };
  
  const handleClearAll = () => {
    setSelectedSchools([]);
    setSelectedActivities([]);
    setSelectedChannels([]);
    setSearchQuery("");
    setSortOrder({ date: "asc", location: "asc" });
    setAppliedFilters('Clear all');
    setEventList([]);
    fetchEvents();
  };

  useEffect(() => {
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
    setAppliedFilters(appliedFilterText.length > 0 ? appliedFilterText.join(' | ') : 'No sorting applied');
  }, [searchQuery, selectedSchools, selectedActivities, selectedChannels, sortOrder]);


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
            sx={{ 
              backgroundColor: '#fafafa',
              borderRadius: 1,
              boxShadow: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
              },
             }}
          />
          <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Schools</InputLabel>
            <Select
              multiple
              value={selectedSchools}
              onChange={(e) => handleMultiSelectChange(e, "schools")}
              renderValue={(selected) => selected.join(', ')}
              sx={{ 
                backgroundColor: '#fafafa',
                borderRadius: 1,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4caf50',
                  },
                },
              }}
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
              sx={{  backgroundColor: '#fafafa',
                borderRadius: 1,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4caf50',
                  },
                }, 
              }}
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
              sx={{  backgroundColor: '#fafafa',
                borderRadius: 1,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4caf50',
                  },
                }, 
              }}
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
      <Box
      sx={{
          mt: 2,
          mb: 4,
          p: 2,
          backgroundColor: 'rgba(0, 128, 0, 0.1)', // soft green
          border: '1px solid rgba(0, 128, 0, 0.3)',
          borderRadius: 1,
          color: '#004d00',
          fontWeight: 'bold',
        }}
      > Filters Applied: {appliedFilters}
    </Box>

    </div>
    </>
  );
}

export default SearchEvent;

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



    // function SearchEvent({ eventList, setEventList }) {
    //   const fetchEvents = useStore((state) => state.fetchEvents);
    //   const [searchQuery, setSearchQuery] = useState('');
    //   const [selectedSchools, setSelectedSchools] = useState([]);
    //   const [selectedActivities, setSelectedActivities] = useState([]);
    //   const [selectedChannels, setSelectedChannels] = useState([]);
    //   const [sortOrder, setSortOrder] = useState({ date: 'asc', location: 'asc' });
    
    //   // Your internal states for schools, activities, and channels
    //   const [schools, setSchools] = useState([
    //     { id: 1, name: 'Albert Lea' },
    //     { id: 2, name: 'Fairbault' },
    //     { id: 3, name: 'Northfield' },
    //   ]);
      
    //   const [activities, setActivities] = useState([
    //     { id: 1, name: 'Basketball' },
    //     { id: 2, name: 'Tennis' },
    //     { id: 3, name: 'Football' },
    //     { id: 4, name: 'Lacrosse' },
    //     { id: 5, name: 'Hockey' },
    //   ]);
    
    //   const [channels, setChannels] = useState([
    //     { id: 1, name: 'ZTV' },
    //     { id: 2, name: 'LeafsTv' },
    //     { id: 3, name: 'ERTv' },
    //     { id: 4, name: 'RogersTv' },
    //   ]);
    
    //   useEffect(() => {
    //     fetchEvents(); // This might fetch all events initially
    //   }, [fetchEvents]);
    
    //   function handleSearch() {
    //     searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels);
    //   }
    
    //   function searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels) {
    //     axios.get(`/api/events?q=${searchQuery}`).then((searchResponse) => {
    //       const searchResults = searchResponse.data || [];
    //       if (searchResults.length) {
    //         filterEvents(searchResults, selectedSchools, selectedActivities, selectedChannels);
    //       } else {
    //         setEventList([]);
    //       }
    //     });
    //   }
    
    //   function filterEvents(searchResults, selectedSchools, selectedActivities, selectedChannels) {
    //     axios.get('/api/events/all').then((fullResponse) => {
    //       const allEvents = fullResponse.data || [];
    //       const filteredEvents = allEvents.filter(event => {
    //         const eventMatchesSearch = searchResults.some(result => result.title === event.title);
    //         const eventMatchesSchool = selectedSchools.length === 0 || selectedSchools.includes(event.school_name);
    //         const eventMatchesActivity = selectedActivities.length === 0 || selectedActivities.includes(event.activity);
    //         const eventMatchesChannel = selectedChannels.length === 0 || selectedChannels.includes(event.channel);
            
    //         return eventMatchesSearch && eventMatchesSchool && eventMatchesActivity && eventMatchesChannel;
    //       });
    
    //       setEventList(filteredEvents);
    //     });
    //   }
    
    //   return (
    //     <div>
    //       <Box>
    //         {/* UI components for searching and filtering */}
    //         <TextField
    //           value={searchQuery}
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //           label="Search"
    //         />
    //         {/* Multi-select inputs for schools, activities, and channels */}
    //         {/* You can pass 'schools', 'activities', 'channels' state and set the filters as needed */}
    //         <Button onClick={handleSearch}>Search</Button>
    //       </Box>
    
    //       {/* Render events */}
    //       {eventList.length > 0 ? (
    //         <ul>
    //           {eventList.map((event) => (
    //             <li key={event.id}>{event.title}</li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <p>No events found</p>
    //       )}
    //     </div>
    //   );
    // }
    