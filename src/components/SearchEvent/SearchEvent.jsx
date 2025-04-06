import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox } from '@mui/material';
import axios from 'axios';

function SearchEvent({ eventList, setEventList }) {
  const fetchEvents = useStore((state) => state.fetchEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState('');
  // Multi-select states
  const [sortBy, setSortBy] = useState(null);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [sortOrder, setSortOrder] = useState({ date: "asc", location: "asc" });
  const [schools, setSchools] = useState([]);
  const [activities, setActivities] = useState([]);


  // Fetch activities, schools, and events when component mounts
  useEffect(() => {
     // Fetch schools
    axios.get('/api/createSchool/schools')
    .then((response) => {
      setSchools(response.data);
    })
    .catch((err) => console.error("Error fetching schools:", err));

    // Fetch activities
    axios.get('/api/createActivity/activities')
      .then((response) => {
        setActivities(response.data);
      })
      .catch((err) => console.error("Error fetching activities:", err));

    // Fetch events
    fetchEvents();
  }, [fetchEvents]);

  // Handle search when parameters change
  useEffect(() => {
    if (sortBy) {
      handleSearch();
    }
  }, [fetchEvents, sortBy, sortOrder]);

  function handleSearch() {
    searchEvents(searchQuery, selectedSchools, selectedActivities);
  }

  // GET Search
  function searchEvents(searchQuery, selectedSchools, selectedActivities) {
    axios.get(`/api/events?q=${searchQuery}`).then((searchResponse) => {
      const searchResults = searchResponse.data || [];
      filterEvents(searchResults, selectedSchools, selectedActivities);
    });
  }

  // Filter events
  function filterEvents(searchResults, selectedSchools, selectedActivities) {
    axios.get('/api/events/all').then((fullResponse) => {
      const allEvents = fullResponse.data || [];

      const filteredEvents = allEvents.filter(event => {
        const eventMatchesSearch = searchResults.some(result => result.title === event.title);
        const eventMatchesSchool = selectedSchools.length === 0 || selectedSchools.includes(event.school_name);
        const eventMatchesActivity = selectedActivities.length === 0 || selectedActivities.includes(event.activity);

        return eventMatchesSearch && eventMatchesSchool && eventMatchesActivity;
      });

      // Sort filtered events based on criteria
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

      setEventList(filteredEvents);
    })
    .catch((error) => {
      console.error("Error fetching all events:", error);
    });
  }

  // Handle multi-select change for filters
  function handleMultiSelectChange(event, type) {
    const selectedOptions = event.target.value;
    if (type === "schools") {
      setSelectedSchools(selectedOptions);
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
    setSearchQuery("");
    setSortOrder({ date: "asc", location: "asc" });
    setAppliedFilters('Clear all');
    setEventList([]);
    fetchEvents();
  };

  // Update applied filters text
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
    setAppliedFilters(appliedFilterText.length > 0 ? appliedFilterText.join(' | ') : 'No sorting applied');
  }, [searchQuery, selectedSchools, selectedActivities, sortOrder]);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
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
          {/* School Multi-Select */}
          <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel>Schools</InputLabel>
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

          {/* Activity Multi-Select */}
          <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel>Activities</InputLabel>
            <Select
              multiple
              value={selectedActivities}
              onChange={(e) => handleMultiSelectChange(e, "activities")}
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
              {activities.map((activity) => (
                <MenuItem key={activity.id} value={activity.activity}>
                  <Checkbox checked={selectedActivities.indexOf(activity.activity) > -1} />
                  <ListItemText primary={activity.activity} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Channel Multi-Select */}
          {/* <FormControl sx={{ width: 200, minWidth: 120 }}>
            <InputLabel>Channels</InputLabel>
            <Select
              multiple
              value={selectedChannels}
              onChange={(e) => handleMultiSelectChange(e, "channels")}
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
              {channels.map((channel) => (
                <MenuItem key={channel.id} value={channel.name}>
                  <Checkbox checked={selectedChannels.indexOf(channel.name) > -1} />
                  <ListItemText primary={channel.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

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

      <Box sx={{
        mt: 2,
        mb: 4,
        p: 2,
        backgroundColor: 'rgba(0, 128, 0, 0.1)', // soft green
        border: '1px solid rgba(0, 128, 0, 0.3)',
        borderRadius: 1,
        color: '#004d00',
        fontWeight: 'bold',
      }}>
        Filters Applied: {appliedFilters}
      </Box>
    </div>
  );
}

export default SearchEvent;

//////////////////////////////////////////////////////////////////////////////////////////


// import useStore from '../../zustand/store';
// import { useState, useEffect } from 'react';
// import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox } from '@mui/material';
// import axios from 'axios';

// function SearchEvent({ eventList, setEventList }) {
//   const fetchEvents = useStore((state) => state.fetchEvents);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [appliedFilters, setAppliedFilters] = useState('');
//   // Multi-select states
//   const [sortBy, setSortBy] = useState(null);
//   const [selectedSchools, setSelectedSchools] = useState([]);
//   const [selectedActivities, setSelectedActivities] = useState([]);
//   const [selectedChannels, setSelectedChannels] = useState([]);
//   const [sortOrder, setSortOrder] = useState({ date: "asc", location: "asc" });

//   const [schools, setSchools] = useState([]);
//   // const [schools, setSchools] = useState([
//   //   { id: 1, name: 'Albert Lea' },
//   //   { id: 2, name: 'Fairbault' },
//   //   { id: 3, name: 'Northfield' },
//   // ]);

//   const [activities, setActivities] = useState([]);
//   const [channels, setChannels] = useState([
//     { id: 1, name: 'Albert Lea Live' },
//     { id: 2, name: 'FairbaultLive' },
//     { id: 3, name: 'NorthfieldLive' },
//   ]);

//   // Fetch activities, schools, and events when component mounts
//   useEffect(() => {
//      // Fetch schools
//     axios.get('/api/createSchool/schools')
//     .then((response) => {
//       setSchools(response.data);
//     })
//     .catch((err) => console.error("Error fetching schools:", err));

//     // Fetch activities
//     axios.get('/api/createActivity/activities')
//       .then((response) => {
//         setActivities(response.data);
//       })
//       .catch((err) => console.error("Error fetching activities:", err));

//     // Fetch events
//     fetchEvents();
//   }, [fetchEvents]);

//   // Handle search when parameters change
//   useEffect(() => {
//     if (sortBy) {
//       handleSearch();
//     }
//   }, [fetchEvents, sortBy, sortOrder]);

//   function handleSearch() {
//     searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels);
//   }

//   // GET Search
//   function searchEvents(searchQuery, selectedSchools, selectedActivities, selectedChannels) {
//     axios.get(`/api/events?q=${searchQuery}`).then((searchResponse) => {
//       const searchResults = searchResponse.data || [];
//       filterEvents(searchResults, selectedSchools, selectedActivities, selectedChannels);
//     });
//   }

//   // Filter events
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

//       // Sort filtered events based on criteria
//       if (sortBy === 'date') {
//         filteredEvents.sort((a, b) =>
//           sortOrder.date === 'asc'
//             ? new Date(a.date) - new Date(b.date)
//             : new Date(b.date) - new Date(a.date)
//         );
//       } else if (sortBy === 'location') {
//         filteredEvents.sort((a, b) =>
//           sortOrder.location === 'asc'
//             ? a.location.localeCompare(b.location)
//             : b.location.localeCompare(a.location)
//         );
//       }

//       setEventList(filteredEvents);
//     })
//     .catch((error) => {
//       console.error("Error fetching all events:", error);
//     });
//   }

//   // Handle multi-select change for filters
//   function handleMultiSelectChange(event, type) {
//     const selectedOptions = event.target.value;
//     if (type === "schools") {
//       setSelectedSchools(selectedOptions);
//     } else if (type === "channels") {
//       setSelectedChannels(selectedOptions);
//     } else if (type === "activities") {
//       setSelectedActivities(selectedOptions);
//     }
//   }

//   const handleSort = (criteria) => {
//     const newSortOrderValue = sortOrder[criteria] === 'asc' ? 'desc' : 'asc';
//     setSortBy(criteria);
//     setSortOrder((prev) => ({
//       ...prev,
//       [criteria]: newSortOrderValue,
//     }));
//   };

//   const handleClearAll = () => {
//     setSelectedSchools([]);
//     setSelectedActivities([]);
//     setSelectedChannels([]);
//     setSearchQuery("");
//     setSortOrder({ date: "asc", location: "asc" });
//     setAppliedFilters('Clear all');
//     setEventList([]);
//     fetchEvents();
//   };

//   // Update applied filters text
//   useEffect(() => {
//     let appliedFilterText = [];
//     if (searchQuery) {
//       appliedFilterText.push(`SEARCH ${searchQuery}`);
//     }
//     if (selectedSchools.length > 0) {
//       appliedFilterText.push(`SCHOOL ${selectedSchools.join(', ')}`);
//     }
//     if (selectedActivities.length > 0) {
//       appliedFilterText.push(`ACTIVITY ${selectedActivities.join(', ')}`);
//     }
//     if (selectedChannels.length > 0) {
//       appliedFilterText.push(`CHANNEL ${selectedChannels.join(', ')}`);
//     }
//     setAppliedFilters(appliedFilterText.length > 0 ? appliedFilterText.join(' | ') : 'No sorting applied');
//   }, [searchQuery, selectedSchools, selectedActivities, selectedChannels, sortOrder]);

//   return (
//     <div>
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
//         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
//           <TextField
//             label="Search"
//             variant="outlined"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{
//               backgroundColor: '#fafafa',
//               borderRadius: 1,
//               boxShadow: 1,
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderColor: '#bdbdbd',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: '#4caf50',
//                 },
//               },
//             }}
//           />
//           {/* School Multi-Select */}
//           <FormControl sx={{ width: 200, minWidth: 120 }}>
//             <InputLabel>Schools</InputLabel>
//             <Select
//               multiple
//               value={selectedSchools}
//               onChange={(e) => handleMultiSelectChange(e, "schools")}
//               renderValue={(selected) => selected.join(', ')}
//               sx={{
//                 backgroundColor: '#fafafa',
//                 borderRadius: 1,
//                 boxShadow: 1,
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#bdbdbd',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#4caf50',
//                   },
//                 },
//               }}
//             >
//               {schools.map((school) => (
//                 <MenuItem key={school.id} value={school.name}>
//                   <Checkbox checked={selectedSchools.indexOf(school.name) > -1} />
//                   <ListItemText primary={school.name} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* Activity Multi-Select */}
//           <FormControl sx={{ width: 200, minWidth: 120 }}>
//             <InputLabel>Activities</InputLabel>
//             <Select
//               multiple
//               value={selectedActivities}
//               onChange={(e) => handleMultiSelectChange(e, "activities")}
//               renderValue={(selected) => selected.join(', ')}
//               sx={{
//                 backgroundColor: '#fafafa',
//                 borderRadius: 1,
//                 boxShadow: 1,
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#bdbdbd',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#4caf50',
//                   },
//                 },
//               }}
//             >
//               {activities.map((activity) => (
//                 <MenuItem key={activity.id} value={activity.activity}>
//                   <Checkbox checked={selectedActivities.indexOf(activity.activity) > -1} />
//                   <ListItemText primary={activity.activity} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* Channel Multi-Select */}
//           <FormControl sx={{ width: 200, minWidth: 120 }}>
//             <InputLabel>Channels</InputLabel>
//             <Select
//               multiple
//               value={selectedChannels}
//               onChange={(e) => handleMultiSelectChange(e, "channels")}
//               renderValue={(selected) => selected.join(', ')}
//               sx={{
//                 backgroundColor: '#fafafa',
//                 borderRadius: 1,
//                 boxShadow: 1,
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#bdbdbd',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#4caf50',
//                   },
//                 },
//               }}
//             >
//               {channels.map((channel) => (
//                 <MenuItem key={channel.id} value={channel.name}>
//                   <Checkbox checked={selectedChannels.indexOf(channel.name) > -1} />
//                   <ListItemText primary={channel.name} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <Button variant="contained" onClick={() => handleSort("date")}>
//             Date {sortOrder.date === "asc" ? "↑" : "↓"}
//           </Button>
//           <Button variant="contained" onClick={() => handleSort("location")}>
//             Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}
//           </Button>
//           <Button variant="contained" onClick={handleSearch}>Search</Button>
//           <Button variant="outlined" onClick={handleClearAll}>Clear All</Button>
//         </Box>
//       </Box>

//       <Box sx={{
//         mt: 2,
//         mb: 4,
//         p: 2,
//         backgroundColor: 'rgba(0, 128, 0, 0.1)', // soft green
//         border: '1px solid rgba(0, 128, 0, 0.3)',
//         borderRadius: 1,
//         color: '#004d00',
//         fontWeight: 'bold',
//       }}>
//         Filters Applied: {appliedFilters}
//       </Box>
//     </div>
//   );
// }

// export default SearchEvent;

