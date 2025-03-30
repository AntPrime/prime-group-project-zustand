import { useState, useEffect } from "react";
import axios from "axios";
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';


function EventsPage() {
  const [newEvent, setNewEvent] = useState({
    activities_id: 0,
    title: "",
    date: "",
    time: "",
    school_id: 0,
    location: "",
    channel: "",
    notes: ""
  });
  const [ eventList, setEventList ] = useState([]);
  const fetchEvents = useStore((state) => state.fetchEvents)
  const navigate = useNavigate(); // Initialize useNavigate

useEffect(()=> {
  fetchEvents()
  fetchEventList()
}, [] );

  function fetchEventList(){
    console.log( 'in fetchEventList' );
    axios.get( '/api/events' ).then(function( response ){
      console.log( response.data )
      setEventList( response.data )
    }).catch( function( err ){
      console.log( err );
      alert( 'error getting test list' );
    })
  }

  //POST to create a new event 
  const createEvent = () => {
    console.log( 'in createEvent' );
    console.log('newEvent:', newEvent);
    axios.post( '/api/events', newEvent).then(function (response){
        console.log( response.data );
        fetchEvents();
        navigate("/studentHomePage");
      }).catch(function ( err ){
        console.log( err );
        alert( 'error creating new event' );
      });  
  };

  return (
    <div className="EventsPage">
      <div>
        <form>
          <select id="activities" placeholder="activities" onChange={(e) => { setNewEvent({ ...newEvent, activities_id: Number ( e.target.value ) });}}>
            <option value="0">Activity</option>
            <option value="1">Basketball</option>
            <option value="2">Tennis</option>
            <option value="3">Football</option>
            <option value="4">Lacrosse</option>
            <option value="5">Hockey</option>
          </select>
          <input placeholder="Date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}/>
          <input placeholder="Time" type="time" value={newEvent.time}  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}/>
          {/* a drop down in this format might not be scalable for client to add new schools*/}
          <select id="school" placeholder="school" onChange={(e) => { setNewEvent({ ...newEvent, school_id: Number ( e.target.value ) })}}>
            <option value="">School</option>
            <option value="1">Alber Lea</option>
            <option value="2">Fairbault</option>
            <option value="3">Northfield</option>
          </select>
        </form>
        <form>
          <input type="text" placeholder="Location" onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}/>
          <input type="text" placeholder="Title" onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}/>
          <select id="channel" placeholder="Channel" onChange={(e) => { setNewEvent({ ...newEvent, channel: e.target.value })}}>
            <option value="">Channel</option>
            <option value="Albert Lea Live">Albert Lea Live</option>
            <option value="Fairbault Live">Fairbault Live</option>
            <option value="Northfield Live">Northfield Live</option>
          </select>
          <input type="text" placeholder="notes" onChange={(e) => setNewEvent({...newEvent,notes: e.target.value,})}/>
        </form>
        <button onClick={createEvent}>Add An Event</button>
        
      </div>
    </div>
 );
}

export default EventsPage;
