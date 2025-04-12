import useStore from '../../zustand/store';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, InputAdornment, Paper, OutlinedInput, Grid, FormControl, ListItemText, Checkbox } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search'




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








// Fetch schools
useEffect(() => {
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
   {/* Search Event Container */}
   <Box sx={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
     <Paper
       elevation={0} // removes box-shadow if you want it completely flat
       sx={{
         p: 0,
         mb: 3,
         backgroundColor: 'transparent',
         boxShadow: 'none',
       }}
     >
       <Box
 sx={{
   display: 'flex',
   alignItems: 'flex-start',
   justifyContent: 'space-between',
   flexWrap: 'wrap', // ✅ allow wrapping
   gap: 2,
   paddingTop: 2,
 }}
>
         {/* Search Input - Longest */}
         <TextField
           fullWidth
           variant="outlined"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           placeholder="Search"
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <SearchIcon sx={{ color: 'action.active' }} />
               </InputAdornment>
             ),
           }}
           sx={{
             flexGrow: 2,
             backgroundColor: '#ffffff',
             borderRadius: 10,
             minWidth: '600px',
             '& .MuiOutlinedInput-root': {
               borderRadius: 10,
             },
           }}
         />
         {/* School Dropdown */}
         <FormControl
           sx={{
             flexGrow: 1.5,
             minWidth: '280px',
             '& .MuiInputLabel-root': {
               whiteSpace: 'nowrap', // Prevents label wrap inside select
             }
           }}
         >
           <InputLabel id="school-label">Filter by School</InputLabel>
           <Select
             labelId="school-label"
             multiple
             value={selectedSchools}
             onChange={(e) => handleMultiSelectChange(e, "schools")}
             label="Filter by School"
             input={<OutlinedInput label="Filter by School" />}
             renderValue={(selected) => selected.join(', ')}
             sx={{
               backgroundColor: '#ffffff',
               borderRadius: 1,
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


         {/* Activity Dropdown */}
         <FormControl sx={{ flexGrow: 1.5, minWidth: '280px' }} variant="outlined">
           <InputLabel id="activity-label">Filter by Activity</InputLabel>
           <Select
             labelId="activity-label"
             multiple
             value={selectedActivities}
             onChange={(e) => handleMultiSelectChange(e, "activities")}
             label="Filter by Activity"
             input={<OutlinedInput label="Filter by Activity" />}
             renderValue={(selected) => selected.join(', ')}
             sx={{
               backgroundColor: '#ffffff',
               borderRadius: 1,
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


         {/* Date Sort Button */}
         <Button
           size="small"
           variant="contained"
           onClick={() => handleSort("date")}
           sx={{ minWidth: '100px', minHeight: '50px' }}
         >
           Date {sortOrder.date === "asc" ? "↑" : "↓"}
         </Button>


         {/* Location Sort Button */}
         <Button
           size="small"
           variant="contained"
           onClick={() => handleSort("location")}
           sx={{ minWidth: '150px', minHeight: '50px' }}
         >
           Location {sortOrder.location === "asc" ? "A-Z" : "Z-A"}
         </Button>


         {/* Search Button */}
         <Button
           size="small"
           variant="contained"
           onClick={handleSearch}
           sx={{ minWidth: '100px', minHeight: '50px' }}
         >
           Search
         </Button>


         {/* Clear All Button */}
         <Button
           size="small"
           variant="outlined"
           onClick={handleClearAll}
           sx={{ minWidth: '100px', minHeight: '50px' }}
         >
           Clear
         </Button>
       </Box>
     </Paper>


     {/* Filters Applied */}
     <Box
       sx={{
         mt: 2,
         mb: 1,
         p: 2,
         backgroundColor: 'rgba(0, 128, 0, 0.1)',
         border: '1px solid rgba(0, 128, 0, 0.3)',
         borderRadius: 1,
         color: '#004d00',
         fontWeight: 'bold',
         textAlign: 'left',
       }}
     >
       Filters Applied: {appliedFilters}
     </Box>
   </Box>
 </div>
);
}




export default SearchEvent;



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

