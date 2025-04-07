import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Snackbar
} from "@mui/material";

function CreateNewActivity({ setActivities, activities, selectedActivityId, setSelectedActivityId }) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  // Fetch activities
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

  const createNewActivity = () => {
    const newActivityData = { activity: activityName };
    axios.post('/api/createActivity/activities', newActivityData)
      .then((response) => {
        console.log("Create activity response:", response.data); // <-- ADD THIS
        fetchActivities();
        setActivityName("");
        setIsAddingActivity(false);
        setSnackbarOpen(true);
        // Optionally auto-select the new one
        setSelectedActivityId(response.data.id);
      })
      .catch((err) => {
        console.log('Error creating new activity:', err);
      });
  };

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
        <InputLabel>Activity</InputLabel>
        <Select
          value={selectedActivityId || ""}
          onChange={(e) => setSelectedActivityId(e.target.value)}
          sx={{
            backgroundColor: '#F2F4F5',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: '2px solid #b0b0b0' },
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
                {activity.activity}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CreateNewActivity;


// import DeleteIcon from '@mui/icons-material/Delete';
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

   {/* <IconButton
                onClick={() => handleDeleteActivity(activity.id)}
                color="secondary"
                size="small"
              >
                <DeleteIcon />
              </IconButton> */}