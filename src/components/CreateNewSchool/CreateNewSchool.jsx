import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Snackbar
} from "@mui/material";

function CreateNewSchool({ setSchools, schools, selectedSchoolId, setSelectedSchoolId }) {
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to fetch all schools
  const fetchSchools = () => {
    axios
      .get("/api/createSchool/schools")
      .then((response) => setSchools(response.data))
      .catch((err) => {
        console.log("Error fetching schools:", err);
      });
  };

  useEffect(() => {
    fetchSchools();
  }, [schools]);

  // Function to create a new school
  const createNewSchool = () => {
    const newSchoolData = { name: schoolName, address: "" };
    axios
      .post("/api/createSchool/schools", newSchoolData)
      .then((response) => {
        // Add the new school to the list
        setSchools((prevSchools) => [...prevSchools, response.data]);
        setSchoolName("");
        setIsAddingSchool(false);
        setSnackbarOpen(true);
        setSelectedSchoolId(response.data.id); // Automatically select the new school
        
        // Re-fetch schools to ensure the latest data is shown in the dropdown
        fetchSchools();
      })
      .catch((err) => {
        console.log("Error creating new school:", err);
      });
  };  

  return (
    <Box sx={{ marginTop: 4 }}>
      {/* Input field for the school name */}
      <TextField
        label="New School Name"
        variant="outlined"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        fullWidth
        sx={{ backgroundColor: "#fff" }}
      />
  
      {/* Button below the input field, aligned to the right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#3498db',
            '&:hover': { bgcolor: '#2980b9' },
            textTransform: 'none',
            borderRadius: '3px',
            px: 3,
            py: 1.5, // Slightly smaller vertical padding
            width: 'auto', // Adjust width to content size
          }}
          onClick={createNewSchool}
        >
          Add New School
        </Button>
      </Box>
  
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="New school added!"
      />
    </Box>
  );
}

export default CreateNewSchool;

