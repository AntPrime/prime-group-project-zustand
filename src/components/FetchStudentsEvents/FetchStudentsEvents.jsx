import {useState, useEffect} from 'react';
import axios from 'axios';

function FetchStudentsEvents({fetchEvents}) {
  useEffect(() => {
    fetchEvents();
  }, []);
  const [ studentsEventsList, setStudentsEventsList ]= useState([])

  const fetchEvents = () => {
    axios
      .get("/api/student")
      .then((response) => {
        console.log(response.data);
        setStudentsEventsList(response.data);
      })
      .catch((err) => {
        console.log("error in FetchStudentsEvents.get incoming", err);
      });
  };
  
  return (
     <div className='FetchStudentsEvents'>
      <p>What's here?{JSON.stringify(studentsEventsList)}</p>
  
    </div>
  );
  }

export default FetchStudentsEvents;