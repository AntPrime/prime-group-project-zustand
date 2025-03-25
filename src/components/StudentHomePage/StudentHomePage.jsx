import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios'

function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    fetchEvent();
  }, []);


  const fetchEvent = () =>{
    console.log("fetching..")

    axios({
      method: "GET",
      url: "/api/events"
  })
  .then((response) => {
      console.log("Response: ", response.data)
      // adding the DB contents into the empty array above
      setEventList(response.data)
  })
  .catch((err) => {
      console.log("GET /api/event is broken")
  })
  }
  return (
    <>
      <h2>LMR STUDENT HOME PAGE</h2>
      <input placeholder='Search Event' />  
      <div>
        <button>Date</button>
        <button>Location</button>
        <select>
          <option value="">Category</option>
        </select>
        <select>
          <option value="">School</option>
        </select>
        <button>Search</button>
        <button>Clear All</button>
      </div>

      <h4>Filter Applied: DATE March 2025 - SCHOOL Elk River - EVENT Show all Events </h4>

      <div className='eventCard'>
        {eventList.length > 0 ? (
          eventList.map((event, index) => (
            <div key={index}> 
            <Box sx={{ minWidth: 275, mb: 2 }} >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    Date: {event.date} - Time of Event: {event.time} <br /> Streaming Channel: {event.channel}
                  </Typography>
                  <Typography variant="h7" component="div">
                    Schools: {event.school_id} vs [Opponent Name]
                  </Typography>
                  <Typography variant="h7" component="div">
                    Location: {event.location}
                  </Typography>
                  <Typography variant="body2">
                    <br />
                    Notes: {event.notes}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Producer: {event.producer}</Button>
                  <Button size="small">Camera: {event.camera}</Button>
                  <Button size="small">Play-by-play: {event.play_by_play}</Button>
                </CardActions>
              </Card>
            </Box>
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>

      <h5></h5>
      <p>Your ID is: {user.id}</p>
      <button onClick={logOut}>Log Out</button>
    </>
  );
}

export default HomePage;
