import axios from 'axios';
import { useState } from "react";
import Button from '@mui/material/Button';
function CreateNewActivity( ) {
  const [ newActivity, setNewActivity]=useState({ activity: ''})
  
  const createNewActivity = () => {
    console.log('new activity', newActivity);
    axios.post( '/api/createActivity', newActivity).then(function (response){
        console.log( response.data );
      }).catch(function ( err ){
        console.log( err );
        alert( 'error creating new activity' );
      });  
  };

return (
   <div className='CreateNewActivity'>
     <input type="text" placeholder="Activity Name" onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}/>
     <Button onClick={ createNewActivity }>Add New Activty</Button>
  </div>
);
}

export default CreateNewActivity;