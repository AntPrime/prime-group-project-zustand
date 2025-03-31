import axios from 'axios';
import { useState } from "react";
import Button from '@mui/material/Button';

function CreateNewSchool( ) {
    
  const [ newSchool, setNewSchool]=useState({ name: '', address: ''})
  
    const createNewSchool = () => {
      console.log('new school', newSchool);
      axios.post( '/api/createSchool', newSchool).then(function (response){
          console.log( response.data );
        }).catch(function ( err ){
          console.log( err );
          alert( 'error creating new school' );
        });  
    };
  
  return (
     <div className='CreateNewSchool'>
       <input type="text" placeholder="School Name" onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}/>
       <input type="text" placeholder="Address" onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}/>
       <Button onClick={ createNewSchool }>Add New School</Button>
    </div>
  );
  }

export default CreateNewSchool;