import axios from 'axios';
import Button from '@mui/material/Button';

function DeleteEvent({eventId}) {

  const eventDelete = () => {
    const isConfirmed = window.confirm("Delete Event?");

    if (isConfirmed) {
      console.log("eventDelete button hit");
      axios
        .delete(`/api/events/${eventId}`)
        .then((response) => {
          console.log("back from delete", response.data);
        })
        .catch((err) => {
          console.log("err in DeleteEvent comp", err);
        });
    }
  };
  
  return (
     <div className='DeleteEvent'>
      <Button style={{color: 'white'}} onClick={eventDelete} >Delete</Button>
    </div>
  );
  }

export default DeleteEvent;