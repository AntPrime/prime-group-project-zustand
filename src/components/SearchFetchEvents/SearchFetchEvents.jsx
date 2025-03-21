import { useState, useEffect } from "react";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Box, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function SearchFetchEvents({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [schoolFilters, setSchoolFilters] = useState([]);
  const [eventTypeFilters, setEventTypeFilters] = useState([]);
  
  // Available options
  const [categories, setCategories] = useState([]);
  const [schools, setSchools] = useState([]);
  const [eventTypes, setEventTypes] = useState([
    "Online Event",
    "In-person Event",
    "Concert",
    "Festival",
    "Sporting Event",
    "Charity Event",
    "Spirit Show"
  ]);

  // Fetch categories and schools on component mount
  useEffect(() => {
    // Fetch categories
    axios.get('/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { id: 1, activity: "Soft Ball" },
          { id: 2, activity: "Soccer Ball" },
          { id: 3, activity: "Foot Ball" },
          { id: 4, activity: "Hockey" },
          { id: 5, activity: "Basketball" },
          { id: 6, activity: "Volleyball" },
          { id: 7, activity: "Golf" },
          { id: 8, activity: "Tennis Ball" }
        ]);
      });

    // Fetch schools
    axios.get('/api/schools')
      .then(response => {
        setSchools(response.data);
      })
      .catch(error => {
        console.error('Error fetching schools:', error);
        // Fallback to hardcoded schools if API fails
        setSchools([
          { id: 1, name: "Elk River High School" },
          { id: 2, name: "Duluth East High School" },
          { id: 3, name: "HANDS" },
          { id: 4, name: "Coon Rapids High School" },
          { id: 5, name: "Rogers High School" }
        ]);
      });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    
    // Build query parameters including filters
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    
    if (categoryFilters.length > 0) {
      categoryFilters.forEach(cat => {
        params.append('category', cat);
      });
    }
    
    if (schoolFilters.length > 0) {
      schoolFilters.forEach(school => {
        params.append('school', school);
      });
    }
    
    if (eventTypeFilters.length > 0) {
      eventTypeFilters.forEach(type => {
        params.append('eventType', type);
      });
    }
    
    axios
      .get(`/api/events?${params.toString()}`)
      .then((response) => {
        console.log("search results", response.data);
        if (onSearchResults) {
          onSearchResults(response.data);
        }
      })
      .catch((err) => {
        console.log("error in search", err);
      });
  };

  // Handle adding a category filter
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (!categoryFilters.includes(value)) {
      setCategoryFilters([...categoryFilters, value]);
    }
  };

  // Handle adding a school filter
  const handleSchoolChange = (event) => {
    const value = event.target.value;
    if (!schoolFilters.includes(value)) {
      setSchoolFilters([...schoolFilters, value]);
    }
  };

  // Handle adding an event type filter
  const handleEventTypeChange = (event) => {
    const value = event.target.value;
    if (!eventTypeFilters.includes(value)) {
      setEventTypeFilters([...eventTypeFilters, value]);
    }
  };

  // Remove a filter
  const removeFilter = (type, value) => {
    if (type === 'category') {
      setCategoryFilters(categoryFilters.filter(cat => cat !== value));
    } else if (type === 'school') {
      setSchoolFilters(schoolFilters.filter(school => school !== value));
    } else if (type === 'eventType') {
      setEventTypeFilters(eventTypeFilters.filter(eventType => eventType !== value));
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <form onSubmit={handleSearch}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value=""
                label="Filter by Category"
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.activity}>
                    {category.activity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by School</InputLabel>
              <Select
                value=""
                label="Filter by School"
                onChange={handleSchoolChange}
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.name}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Event</InputLabel>
              <Select
                value=""
                label="Filter by Event"
                onChange={handleEventTypeChange}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {/* Display active filters */}
      {(categoryFilters.length > 0 || schoolFilters.length > 0 || eventTypeFilters.length > 0) && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Active Filters:</Typography>
          
          {categoryFilters.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Filter by Category:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categoryFilters.map((filter) => (
                  <Chip 
                    key={filter}
                    label={filter}
                    onDelete={() => removeFilter('category', filter)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {schoolFilters.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Filter by School:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {schoolFilters.map((filter) => (
                  <Chip 
                    key={filter}
                    label={filter}
                    onDelete={() => removeFilter('school', filter)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {eventTypeFilters.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Filter by Event:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {eventTypeFilters.map((filter) => (
                  <Chip 
                    key={filter}
                    label={filter}
                    onDelete={() => removeFilter('eventType', filter)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default SearchFetchEvents;