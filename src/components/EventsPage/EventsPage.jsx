import { useState, useEffect } from "react";
import axios from "axios";
import UpdateEvent from "../UpdateEvent/UpdateEvent";
import useStore from '../../zustand/store';
import moment from 'moment';
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
  // const [searchResults, setSearchResults] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");


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

  // //GET request for search results
  // const Search = () => {
  //   console.log("Fetching query:", searchQuery);
  //   axios
  //     .get(`/api/events?q=${searchQuery}`)
  //     .then((response) => {
  //       setSearchResults(response.data);
  //       console.log("search results", response.data);
  //     })
  //     .catch((error) => {
  //       console.log("Error on GET", error);
  //     });
  // };

  //POST to create a new event 
  const createEvent = () => {
    console.log( 'in createEvent' );
    console.log('newEvent:', newEvent);
    axios.post( '/api/events', newEvent).then(function (response){
        console.log( response.data );
        fetchEvents();
      }).catch(function ( err ){
        console.log( err );
        alert( 'error creating new event' );
      });  
  };

  return (
    <div className="EventsPage">
      <div>
        {/* <p>Search Events</p>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={Search}>Search</button>
        <p>{JSON.stringify(searchResults)}</p> */}
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
        {/* <UpdateEvent /> */}
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
        <button onClick={ createEvent }>Add An Event</button>
      </div>
    </div>
 );
}

export default EventsPage;


  // // Function to format the date using Moment.js
  // function formatDate(date) {
  //   return date ? moment(date).format('MM/DD/YYYY') : 'No Date'; // Format date to MM/DD/YYYY
  // }
  //  // Function to format the time using Moment.js
  //  function formatTime(time) {
  //   return time ? moment(time, "HH:mm").format('hh:mm A') : 'No Time'; // Format time to 12-hour format
  // }

  // <h2>Test List</h2>
  // <table>
  //   <thead>
  //     <tr>
  //     <th>Title</th>
  //     <th>Activity</th>
  //     <th>Date</th>
  //     <th>Time</th>
  //     <th>Location</th>
  //     <th>School</th>
  //     <th>Channel</th>
  //     <th>Notes</th>
  //     </tr>
  //   </thead>
  //   <tbody>
  //   { eventList.map(( item , index  ) => (
  //         <tr key={index}>
  //         <td><p>{item.title || "No Title"}</p></td>
  //         <td><p>{item.activity || "No Activity"}</p></td>
  //         <td>{item.date ? moment(item.date).format('MM/DD/YYYY') : 'No Date'}</td> {/* Display date */}
  //         <td>{item.time ? moment(item.time, "HH:mm").format('hh:mm A') : 'No Time'}</td> {/* Display time */}
  //         <td><p>{item.location || "No Location"}</p></td>
  //         <td><p>{item.schoolname || "Unknown School"}</p></td>
  //         <td><p>{item.channel || "Unknown Channel"}</p></td>
  //         <td><p>{item.notes || "No Notes"}</p></td>
  //         </tr>
  //       ))}
  //   </tbody>
  // </table>