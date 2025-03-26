import axios from "axios";
import { useState } from "react";


function UpdateEvent( ) {
  const [ updatedEvent, setUpdatedEvent ]=useState({ title: ""});

  const update=(e)=>{
    axios.put(`/api/events`, updatedEvent )
    .then(( response  )=>{
      console.log( "response from update in UpdateEvent", response.data );
    }).catch(( err )=>{
      console.log("error in UpdateEvent", err );
    });
    };

  return (
     <div className='UpdateEvent'>
  <div>
        <p>Add event</p>
        <form >
          <select
            onChange={(e) => {
              setUpdatedEvent({ ...updatedEvent, activities_id: e.target.value });
            }}
          >
            <option value="">Activity</option>
            <option value="1">Basketball</option>
            <option value="2">Tennis</option>
            <option value="3">Football</option>
            <option value="4">Lacrosse</option>
            <option value="5">Hockey</option>
          </select>
          <input placeholder="Date" type="date" onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}/>
          <input placeholder="Time" type="time" onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}/>
          {/* a drop down in this format might not be scalable for client to add new schools*/}
          <select
            onChange={(e) => {
              setUpdatedEvent({ ...updatedEvent, school_id: e.target.value });
            }}
          >
            <option value="">School</option>
            <option value="1">Alber Lea</option>
            <option value="2">Fairbault</option>
            <option value="3">Northfield</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Title"
            onChange={(e) =>
              setUpdatedEvent({
                ...updatedEvent,
                title: e.target.value,
              })
            }
          />
          {/* This channel select is a little redundant. Just threw it in there for now*/}
          <select
            onChange={(e) => {
              setUpdatedEvent({ ...updatedEvent, channel: e.target.value });
            }}
          >
            <option value="">Channel</option>
            <option value="Albert Lea Live">Albert Lea Live</option>
            <option value="Fairbault Live">Fairbault Live</option>
            <option value="Northfield Live">Northfield Live</option>
          </select>
          <input
            type="text"
            placeholder="notes"
            onChange={(e) =>
              setUpdatedEvent({
                ...updatedEvent,
                notes: e.target.value,
              })
            }
          />
             <button onClick={ update }>Update event</button>   
        </form>
      </div>
    </div>
  );
  }

export default UpdateEvent;