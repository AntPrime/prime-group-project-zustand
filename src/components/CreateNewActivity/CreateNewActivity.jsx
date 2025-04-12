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
  }, [ activities ]);

  const createNewActivity = () => {
    const newActivityData = { activity: activityName };
    axios.post('/api/createActivity/activities', newActivityData)
      .then((response) => {
        fetchActivities();
        setActivityName("");
        setSnackbarOpen(true);
        setSelectedActivityId(response.data.id);
      })
      .catch((err) => {
        console.log('Error creating new activity:', err);
      });
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      {/* Input field for the new activity name */}
      <TextField
        label="New Activity Name"
        variant="outlined"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        fullWidth
        sx={{ backgroundColor: "#fff", marginTop: -2 }}
      />
      {/* Add button aligned right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#3498db',
            '&:hover': { bgcolor: '#2980b9' },
            textTransform: 'none',
            borderRadius: '3px',
            px: 3,
            py: 1.5,
            width: 'auto',
          }}
          onClick={createNewActivity}
        >
          Add New Activity
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="New activity added!"
      />
    </Box>
  );
}

export default CreateNewActivity;
