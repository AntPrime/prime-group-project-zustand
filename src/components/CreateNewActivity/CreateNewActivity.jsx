import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
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

  const handleDeleteActivity = (activityId) => {
    axios.delete(`/api/createActivity/activities/${activityId}`)
      .then(() => {
        setActivities(prev => prev.filter(activity => activity.id !== activityId));
        setSelectedActivities(prev => prev.filter(id => id !== activityId));
      })
      .catch((err) => {
        console.log('Error deleting activity:', err);
        alert('Error deleting activity');
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
        <InputLabel>Activities</InputLabel>
        <Select
          multiple
          value={selectedActivities}
          onChange={handleActivityChange}
          renderValue={(selected) => {
            const selectedNames = activities
              .filter(activity => selected.includes(activity.id))
              .map(activity => activity.activity); // <-- fix here
            return selectedNames.join(', ') || 'No activities selected';
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
                <IconButton
                  onClick={() => handleDeleteActivity(activity.id)}
                  color="secondary"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CreateNewActivity;

//   const createNewSchool = () => {
//     const newSchoolData = { name: schoolName, address: '' };
//     axios.post('/api/createSchool/schools', newSchoolData)
//       .then((response) => {
//         const newId = response.data.id; // Assuming backend returns new school's ID
//         fetchSchools();
//         setSchoolName("");
//         setNewSchool({ name: '', address: '' });
//         setIsAddingSchool(false); // Switch back to multi-select mode
//         setSnackbarOpen(true); // Show popup
//         setSelectedSchools((prev) => [...prev, newId]); // Optional: auto-select new school
//       })
//       .catch((err) => {
//         console.log('Error creating new school:', err);
//         alert('Error creating new school');
//       });
//   };

//   const handleSchoolChange = (event) => {
//     const { value } = event.target;
//     setSelectedSchools(value);
//   };

//   const handleDeleteSchools = (schoolId) => {
//     axios.delete(`/api/createSchool/schools/${schoolId}`)
//       .then(() => {
//         setSchools(prev => prev.filter(school => school.id !== schoolId));
//         setSelectedSchools(prev => prev.filter(id => id !== schoolId));
//       })
//       .catch(err => {
//         console.log('Error deleting school:', err);
//         alert('Error deleting school');
//       });
//   };

//   return (
//     <Box sx={{ marginTop: 4 }}>
   

//       <Button onClick={() => setIsAddingSchool(!isAddingSchool)}>
//         {isAddingSchool ? "Cancel Adding" : "Add New School"}
//       </Button>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSnackbarOpen(false)}
//         message="New school added!"
//       />
      
//       <FormControl fullWidth sx={{ marginTop: 2 }}>
//         <InputLabel>Schools</InputLabel>
//         <Select
//           multiple
//           value={selectedSchools}
//           onChange={handleSchoolChange}
//           renderValue={(selected) => {
//             const selectedNames = schools
//               .filter(school => selected.includes(school.id))
//               .map(school => school.name);
//             return selectedNames.join(', ') || 'No schools selected';
//           }}
//         >
//     {isAddingSchool ? (
//   <MenuItem disableRipple sx={{ paddingY: 2, paddingX: 2 }}>
//     <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
//       <TextField
//         label="New School Name"
//         variant="outlined"
//         value={schoolName}
//         onChange={(e) => setSchoolName(e.target.value)}
//         fullWidth
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={createNewSchool}
//         disabled={!schoolName.trim()}
//         fullWidth
//       >
//         Add School
//       </Button>
//     </Box>
//   </MenuItem>
// ) : (
//             schools.map((school) => (
//               <MenuItem key={school.id} value={school.id}>
//                 <Checkbox checked={selectedSchools.includes(school.id)} />
//                 <ListItemText primary={school.name} />
//                 <IconButton
//                   onClick={() => handleDeleteSchools(school.id)}
//                   color="secondary"
//                   size="small"
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </MenuItem>
//             ))
//           )}
//         </Select>
//       </FormControl>
//     </Box>
//   );
// }

// export default CreateNewSchool;