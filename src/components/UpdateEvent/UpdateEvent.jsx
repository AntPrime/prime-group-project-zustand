
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';


function UpdateEvent( ) {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};
  const [ updatedEvent, setUpdatedEvent ]=useState(event ||{ 
    activities_id: 0,
    title: "",
    date: "",
    time: "",
    school_id: 0,
    location: "",
    channel: "",
    notes: ""
  });

  const update=(e)=>{
    axios.put(`/api/events`, updatedEvent ).then(( response  )=>{
      console.log( "UpdateEvent PUT", response.data );
      navigate("/events"); 
        }).catch(( err )=>{
          console.log("error in UpdateEvent", err );
        });
    };

    return (
      <div className="UpdateEvent">
        <h1>Update Event</h1>
        <select
          value={updatedEvent.activities_id}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, activities_id: e.target.value })}
        >
          <option value="">Activity</option>
          <option value="1">Basketball</option>
          <option value="2">Tennis</option>
          <option value="3">Football</option>
          <option value="4">Lacrosse</option>
          <option value="5">Hockey</option>
        </select>
        <p>Title</p>
        <input
          type="text"
          placeholder="Title"
          value={updatedEvent.title}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
        />
        <input
          type="date"
          value={updatedEvent.date}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
        />
        <input
          type="time"
          value={updatedEvent.time}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, time: e.target.value })}
        />
        <select
          value={updatedEvent.school_id}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, school_id: e.target.value })}
        >
          <option value="">School</option>
          <option value="1">Alber Lea</option>
          <option value="2">Fairbault</option>
          <option value="3">Northfield</option>
        </select>
        <input
          type="text"
          placeholder="Location"
          value={updatedEvent.location}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Notes"
          value={updatedEvent.notes}
          onChange={(e) => setUpdatedEvent({ ...updatedEvent, notes: e.target.value })}
        />
        <button onClick={update}>Update Event</button>
      </div>
    );
  }
  
  export default UpdateEvent;
