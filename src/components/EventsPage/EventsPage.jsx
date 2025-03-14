import axios from "axios";
import {useState} from "react";


function EventsPage( ) {
  
  const [ event, setEvent ] = useState({location: ''})

  const createEvent=()=>{
    console.log("sending event", event )
      axios.post('/api/events', event)
      .then(( response )=>{
        alert("event sent");
        setEvent({ location: '' });
      })
      .catch(( err )=>{
        console.log("error in event post", err )
      })
  }

  return (
     <div className='EventsPage'>
      <p>Add event</p>
      <form       onSubmit={(e) => {
          
          createEvent(event);
        }}>
           <input
                type="text"
                placeholder="new location"
                onChange={(e) =>
                  setEvent({
                    ...event,
                    location: e.target.value,
                       })
                }
              />
                <button type="submit">
              add location
              </button>
        </form>
    </div>
  );
  }

export default EventsPage;