import axios from 'axios';
import { useState } from "react";
import Button from '@mui/material/Button';

function CreateNewSchool({ setSchools, schools } ) {
  const [ newSchool, setNewSchool]=useState({ name: '', address: ''})

  // GET fetchSchools list
    const fetchSchools = () => {
      axios.get('/api/createSchool/schools')  // Make sure this matches your backend route
        .then((response) => {
          setSchools(response.data);;  // Update the list of schools
        })
        .catch((err) => {
          console.log('Error fetching schools:', err);
          alert('Error fetching schools');
        });
    };

  // POST createNewSchool
  const createNewSchool = () => {
    console.log('new school', newSchool);
    axios.post('/api/createSchool/schools', newSchool)
      .then((response) => {
        console.log(response.data);
        // Fetch updated list of schools after successfully creating a new school
        fetchSchools();  // Call the simplified fetchSchools function
      })
      .catch((err) => {
        console.log(err);
        alert('Error creating new school');
      });
  };

  // Function to handle school deletion
  const deleteSchool = (schoolId) => {
    axios.delete(`/api/createSchool/schools/${schoolId}`)
      .then((response) => {
        console.log('School deleted:', response);
        // Re-fetch the list of schools after deletion to reflect the changes
        fetchSchools();
      })
      .catch((err) => {
        console.log('Error deleting school:', err);
        alert('Error deleting school');
      });
  };

  return (
     <div className='CreateNewSchool'>
       <input type="text" placeholder="School Name" onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}/>
       <input type="text" placeholder="Address" onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}/>
       <Button onClick={ createNewSchool }>Add New School</Button>
       <div className="school-list">
        {schools && schools.length > 0 && (
          schools.map((school) => (
            <div key={school.id} className="school-item">
              <span>{school.name}</span>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => deleteSchool(school.id)}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
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