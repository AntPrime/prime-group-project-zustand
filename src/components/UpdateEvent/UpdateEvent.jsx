import axios from "axios";
import { useState } from "react";


function UpdateEvent( ) {
  const [ updatedEvent, setUpdatedEvent ]=useState({ 
    activities_id: 0,
    title: "",
    date: 0,
    time: 0,
    school_id: 0,
    location: "",
    channel: "",
    notes: ""
  });

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
      <h1>Update Event</h1>
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
        <p>Title<input type="text" placeholder="title" onChange={(e)=>{ setUpdatedEvent({ ...updatedEvent, title: e.target.value })}} /></p>
        <input placeholder="Date" type="date" onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}/>
        <input placeholder="Time" type="time" onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}/>
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
            placeholder="notes"
            onChange={(e) =>
              setUpdatedEvent({
                ...updatedEvent,
                notes: e.target.value,
              })
            }
          />
       <button onClick={ update }>Update Profile</button>  
    </div>
  );
  }

export default UpdateEvent;