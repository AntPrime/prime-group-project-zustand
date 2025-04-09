import axios from 'axios';
import Button from '@mui/material/Button';

function DeleteEvent({eventId , sx}) {

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
        <Button
      variant="contained"
      className='float-button' 
      style={{backgroundColor: 'red'}}
      sx={sx}
      onClick={eventDelete}
    >
      Delete Event
    </Button>
    </div>
  );
  }

export default DeleteEvent;