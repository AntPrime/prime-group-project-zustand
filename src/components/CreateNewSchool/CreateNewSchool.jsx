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

function CreateNewSchool({ setSchools, schools }) {
  const [newSchool, setNewSchool] = useState({ name: '', address: '' });
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchSchools = () => {
    axios.get('/api/createSchool/schools')
      .then((response) => setSchools(response.data))
      .catch((err) => {
        console.log('Error fetching schools:', err);
        alert('Error fetching schools');
      });
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const createNewSchool = () => {
    const newSchoolData = { name: schoolName, address: '' };
    axios.post('/api/createSchool/schools', newSchoolData)
      .then((response) => {
        const newId = response.data.id; // Assuming backend returns new school's ID
        fetchSchools();
        setSchoolName("");
        setNewSchool({ name: '', address: '' });
        setIsAddingSchool(false); // Switch back to multi-select mode
        setSnackbarOpen(true); // Show popup
        setSelectedSchools((prev) => [...prev, newId]); // Optional: auto-select new school
      })
      .catch((err) => {
        console.log('Error creating new school:', err);
        alert('Error creating new school');
      });
  };

  const handleSchoolChange = (event) => {
    const { value } = event.target;
    setSelectedSchools(value);
  };

  // const handleDeleteSchools = (schoolId) => {
  //   axios.delete(`/api/createSchool/schools/${schoolId}`)
  //     .then(() => {
  //       setSchools(prev => prev.filter(school => school.id !== schoolId));
  //       setSelectedSchools(prev => prev.filter(id => id !== schoolId));
  //     })
  //     .catch(err => {
  //       console.log('Error deleting school:', err);
  //       alert('Error deleting school');
  //     });
  // };

  return (
    <Box sx={{ marginTop: 4 }}>
   

      <Button onClick={() => setIsAddingSchool(!isAddingSchool)}>
        {isAddingSchool ? "Cancel Adding" : "Add New School"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="New school added!"
      />
      
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel>Schools</InputLabel>
        <Select
          multiple
          value={selectedSchools}
          onChange={handleSchoolChange}
          renderValue={(selected) => {
            const selectedNames = schools
              .filter(school => selected.includes(school.id))
              .map(school => school.name);
            return selectedNames.join(', ') || 'No schools selected';
          }}
        >
    {isAddingSchool ? (
  <MenuItem disableRipple sx={{ paddingY: 2, paddingX: 2 }}>
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <TextField
        label="New School Name"
        variant="outlined"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={createNewSchool}
        disabled={!schoolName.trim()}
        fullWidth
      >
        Add School
      </Button>
    </Box>
  </MenuItem>
) : (
            schools.map((school) => (
              <MenuItem key={school.id} value={school.id}>
                <Checkbox checked={selectedSchools.includes(school.id)} />
                <ListItemText primary={school.name} />
                {/* <IconButton
                  onClick={() => handleDeleteSchools(school.id)}
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

export default CreateNewSchool;




// function CreateNewSchool({ setSchools, schools } ) {
//   const [ newSchool, setNewSchool]=useState({ name: '', address: ''})
  
//     const createNewSchool = () => {
//       console.log('new school', newSchool);
//       axios.post( '/api/createSchool', newSchool).then(function (response){
//           console.log( response.data );
          
//         }).catch(function ( err ){
//           console.log( err );
//           alert( 'error creating new school' );
//         });  
//     };