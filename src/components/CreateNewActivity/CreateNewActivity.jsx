import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  TextField,
  Snackbar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function CreateNewActivity({ setActivities, activities }) {
  const [newActivity, setNewActivity] = useState({ name: '' });
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch existing activities
  const fetchActivities = () => {
    axios.get('/api/createActivity/activities')
      .then((response) => setActivities(response.data))
      .catch((err) => {
        console.log('Error fetching activities:', err);
        alert('Error fetching activities');
      });
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Create a new activity
const createNewActivity = () => {
  const newActivityData = { activity: activityName };  // Ensure key is `activity`
  axios.post('/api/createActivity/activities', newActivityData)
    .then((response) => {
      fetchActivities();
      setActivityName("");
      setNewActivity({ name: '' });
      setIsAddingActivity(false);  // Switch back to multi-select mode
      setSnackbarOpen(true);  // Show snackbar
      setSelectedActivities((prev) => [...prev, response.id]);  // Select newly created activity by ID
    })
    .catch((err) => {
      console.log('Error creating new activity:', err);
      alert('Error creating new activity');
    });
};

  const handleActivityChange = (event) => {
    const { value } = event.target;
    setSelectedActivities(value);
  };

  // const handleDeleteActivity = (activityId) => {
  //   axios.delete(`/api/createActivity/activities/${activityId}`)
  //     .then(() => {
  //       setActivities(prev => prev.filter(activity => activity.id !== activityId));
  //       setSelectedActivities(prev => prev.filter(id => id !== activityId));
  //     })
  //     .catch((err) => {
  //       console.log('Error deleting activity:', err);
  //       alert('Error deleting activity');
  //     });
  // };

  return (
    <Box sx={{ marginTop: 4 }}>

    <Button onClick={() => setIsAddingActivity(!isAddingActivity)}>
      {isAddingActivity ? "Cancel Adding" : "Add New Activity"}
    </Button>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      message="New activity added!"
    />

    <FormControl fullWidth sx={{ marginTop: 2 }}>
      <InputLabel>Activities</InputLabel>
      <Select
        multiple
        value={selectedActivities}
        onChange={handleActivityChange}
        renderValue={(selected) => {
          const selectedNames = activities
            .filter(activity => selected.includes(activity.id))
            .map(activity => activity.activity);
          return selectedNames.join(', ') || 'No activities selected';
        }}
        sx={{
          backgroundColor: '#F2F4F5',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused fieldset': { border: '2px solid #b0b0b0' },
          },
          '& .MuiCheckbox-root': {
            color: '#081C32', // Dark blue checkmarks
          },
          '& .Mui-checked': {
            color: '#081C32', // Dark blue checked state
          },
        }}
      >
        {isAddingActivity ? (
          <MenuItem disableRipple sx={{ paddingY: 2, paddingX: 2 }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <TextField
                label="New Activity Name"
                variant="outlined"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={createNewActivity}
                disabled={!activityName.trim()}
                fullWidth
              >
                Add Activity
              </Button>
            </Box>
          </MenuItem>
        ) : (
          activities.map((activity) => (
            <MenuItem key={activity.id} value={activity.id}>
              <Checkbox checked={selectedActivities.includes(activity.id)} />
              <ListItemText primary={activity.activity} />
              {/* <IconButton
                onClick={() => handleDeleteActivity(activity.id)}
                color="secondary"
                size="small"
              >
                <DeleteIcon />
              </IconButton> */}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  </Box>
);
}

export default CreateNewActivity;