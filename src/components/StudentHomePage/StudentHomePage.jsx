import useStore from '../../zustand/store'
import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions, Button, Typography } from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import moment from 'moment';
import SearchEvent from '../SearchEvent/SearchEvent';
import axios from 'axios';

function StudentHomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);
  const [eventList, setEventList] = useState([]);

  useEffect(()=> {
    fetchEventList()
  }, [] );

    // GET fetchEventList 
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

    // PUT Assign user role
    function assignRoles(event, roleColumn) {
      console.log('Assign user to role:', { eventId: event.id, roleColumn: roleColumn });
      axios.put( '/api/assignRole/assignRole', {
        eventId: event.id,
        roleColumn,
      }).then(function(response){
        // setEventList(response.data);
        setEventList((prevEvents) =>
          prevEvents.map((prevEvent) =>
            prevEvent.id === response.data.id ? response.data : prevEvent ));
        fetchEventList();
      }).catch(function() {
        alert('Error assigning role');
      });
    }

    function formatDate(dateString) {
      return moment(dateString).format("MM/DD/YYYY"); // Example: 03/30/2025
    }
    function formatTime(timeString) {
      return moment(timeString, "HH:mm:ss").format("h:mm a"); // 'a' gives you am/pm
    }    
    
    return (
      <>
      <div>
        <h2>LMR STUDENT HOME PAGE</h2>
        <SearchEvent eventList={eventList} setEventList={setEventList} />
      </div>
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
                  <strong>Date:</strong> {formatDate(event.date)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Time:</strong> {formatTime(event.time)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Streaming Channel:</strong> {event.channel}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>School:</strong> {event.school_name || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Activity:</strong> {event.activity || "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {event.location || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Notes:</strong> {event.notes || "N/A"}
                </Typography>
              </AccordionDetails>
              <AccordionActions>
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
              </AccordionActions>
            </Accordion>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </>
  );
}


export default StudentHomePage;
