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

function CreateNewSchool({ setSchools, schools, selectedSchoolId, setSelectedSchoolId }) {
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchSchools = () => {
    axios.get('/api/createSchool/schools')
      .then((response) => setSchools(response.data))
      .catch((err) => {
        console.log('Error fetching schools:', err);
      });
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const createNewSchool = () => {
    const newSchoolData = { name: schoolName, address: '' };
    axios.post('/api/createSchool/schools', newSchoolData)
      .then((response) => {
        const newId = response.data.id;
        fetchSchools();
        setSchoolName("");
        setIsAddingSchool(false);
        setSnackbarOpen(true);
        setSelectedSchoolId(newId);
      })
      .catch((err) => {
        console.log('Error creating new school:', err);
      });
  };

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
        <InputLabel>School</InputLabel>
        <Select
          value={selectedSchoolId || ""}
          onChange={(e) => setSelectedSchoolId(e.target.value)}
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
                {school.name}
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