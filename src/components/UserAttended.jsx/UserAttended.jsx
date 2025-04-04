import axios from "axios";
import { useState, useEffect } from "react";
import SearchFetchEvents from "../SearchFetchEvents/SearchFetchEvents";
import { Box, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Chip, ListItemText, Checkbox } from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import moment from 'moment';

function UserAttended( ) {
  const [eventList, setEventList] = useState([]);

   function fetchEventList() {
        console.log( 'in fetchEventList' );
        axios.get( '/api/events/all' ).then(function( response ){
          console.log( response.data )
          setEventList( response.data ) 
        }).catch( function( err ){
              console.log( err );
              alert( 'error getting test list' );
            })
      }
          function formatDate(dateString) {
            return moment(dateString).format("MM/DD/YYYY"); // Example: 03/30/2025
          }
      
          function formatTime(timeString) {
            return moment(timeString, "HH:mm:ss").format("h:mm A"); // Example: 3:30 PM
          }
        useEffect(()=> {
          // fetchEvents()
          fetchEventList()
        }, [] );
  return (
     <div className='UserAttended'>
  <h1>
    EVENTS USERS Attended
  </h1>
   <div className='eventCard'>
          {eventList.length > 0 ? (
            eventList.map((event, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<IoIosArrowDropdown />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography component="span" sx={{ fontWeight: 'bold' }}>
                    {event.title} - {event.date} | {event.time}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Created by:</strong> {event.created_by_id}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {formatDate(event.date)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Time:</strong> {formatTime(event.time)} 
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Streaming Channel:</strong> {event.channel}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Schools:</strong> {event.school_name} vs {event.opponent_name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {event.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Notes:</strong> {event.notes}
                  </Typography>
                </AccordionDetails>
                {/* <AccordionActions>
                  <Button size="small" onClick={() => assignRoles(event, "producer")} disabled={!!event.producer}>
                    Producer: {event.producer_username || "(Unassigned)"}
                  </Button>
                  <Button size="small" onClick={() => assignRoles(event, "camera")} disabled={!!event.camera}>
                    Camera: {event.camera_username || "(Unassigned)"}
                  </Button>
                  <Button size="small" onClick={() => assignRoles(event, "play_by_play")} disabled={!!event.play_by_play}>
                    Play-by-play: {event.play_by_play_username || "(Unassigned)"}
                  </Button>
                  <Button size="small" onClick={() => assignRoles(event, "color_commentator")} disabled={!!event.color_commentator}>
                    Color Commentator: {event.color_commentator_username || "(Unassigned)"}
                  </Button>
                </AccordionActions> */}
              </Accordion>
            ))
          ) : (
            <h4>No events found</h4>
          )}
        </div>
    </div>
  );
  }

export default UserAttended;