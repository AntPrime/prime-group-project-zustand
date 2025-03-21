import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFetchEvents from '../SearchFetchEvents/SearchFetchEvents';
import { 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography, 
  Grid,
  Divider
} from '@mui/material';

function StudentHomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Fetch all events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('/api/events/all')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  // Handle search results from SearchFetchEvents
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // Get activity name from ID
  const getActivityName = (id) => {
    const activities = {
      1: "Basketball",
      2: "Tennis",
      3: "Football",
      4: "Lacrosse",
      5: "Hockey"
    };
    return activities[id] || "Unknown";
  };

  // Get school name from ID
  const getSchoolName = (id) => {
    const schools = {
      1: "Albert Lea",
      2: "Faibault",
      3: "Northfield"
    };
    return schools[id] || "Unknown";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Display either search results or all events
  const displayEvents = searchResults.length > 0 ? searchResults : events;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>LMR STUDENT HOME PAGE</Typography>
      
      {/* Search and filter component */}
      <SearchFetchEvents onSearchResults={handleSearchResults} />
      
      {/* Display events */}
      <Typography variant="h5" gutterBottom>
        {searchResults.length > 0 ? 'Search Results' : 'Upcoming Events'}
      </Typography>
      
      <Grid container spacing={3}>
        {displayEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id || event["events id"]}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  {event.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  DATE: {formatDate(event.date)} - TIME: {event.time} - CATEGORY: {
                    event.activity || getActivityName(event.activities_id)
                  }
                </Typography>
                <Typography variant="body1" component="div">
                  SCHOOLS: {event["school name"] || getSchoolName(event.school_id)}
                </Typography>
                <Typography variant="body1" component="div">
                  LOCATION: {event.location}
                </Typography>
                <Typography variant="body2">
                  <br />
                  DETAILS: {event.notes}
                </Typography>
              </CardContent>
              <CardActions>
                {/* Only show sign-up buttons if user is logged in */}
                {user && user.id && (
                  <>
                    <Button size="small" variant="outlined">Producer</Button>
                    <Button size="small" variant="outlined">Camera</Button>
                    <Button size="small" variant="outlined">Play-by-play</Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        {user && user.id ? (
          <>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Logged in as: {user.username} (ID: {user.id})
            </Typography>
            <Button variant="contained" color="secondary" onClick={logOut}>
              Log Out
            </Button>
          </>
        ) : (
          <Typography variant="body2">
            Please log in to sign up for events
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default StudentHomePage;
