import React, { useState, useEffect } from "react";
import { Select, MenuItem, Checkbox, ListItemText, IconButton, TextField, Button, Snackbar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

function SchoolSelect({ schools, selectedSchools, handleSchoolChange, setSchools }) {
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
        setIsAddingSchool(false); // Switch back to multi-select mode
        setSnackbarOpen(true); // Show popup
        handleSchoolChange({
          target: { value: [...selectedSchools, newId] }
        }); // Auto-select new school
      })
      .catch((err) => {
        console.log('Error creating new school:', err);
        alert('Error creating new school');
      });
  };

  const handleDeleteSchool = (schoolId) => {
    axios.delete(`/api/createSchool/schools/${schoolId}`)
      .then(() => {
        setSchools(prev => prev.filter(school => school.id !== schoolId));
        handleSchoolChange({
          target: { value: selectedSchools.filter(id => id !== schoolId) }
        });
      })
      .catch(err => {
        console.log('Error deleting school:', err);
        alert('Error deleting school');
      });
  };

  return (
    <div>
      <Button onClick={() => setIsAddingSchool(!isAddingSchool)}>
        {isAddingSchool ? "Cancel Adding" : "Add New School"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="New school added!"
      />
      
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
        fullWidth
      >
        {isAddingSchool ? (
          <MenuItem disableRipple sx={{ paddingY: 2, paddingX: 2 }}>
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
              sx={{ marginTop: 2 }}
            >
              Add School
            </Button>
          </MenuItem>
        ) : (
          schools.map((school) => (
            <MenuItem key={school.id} value={school.id}>
              <Checkbox checked={selectedSchools.includes(school.id)} />
              <ListItemText primary={school.name} />
              <IconButton
                onClick={() => handleDeleteSchool(school.id)}
                color="secondary"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Select>
    </div>
  );
}

export default SchoolSelect;
