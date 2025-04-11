import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import moment from 'moment';
import useStore from '../../zustand/store'; // Add this import

function UserAttended() {
  const [eventList, setEventList] = useState([]);
  const user = useStore((state) => state.user); // Get current user from store

  const fetchUserEvents = async () => {
    try {
      const response = await axios.get(`/api/events/attended/registered/${user.id}`);
      setEventList(response.data);
    } catch (err) {
      console.error('Error fetching user events:', err);
      alert('Error loading events');
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MM/DD/YYYY");
  };

  const formatTime = (timeString) => {
    return moment(timeString, "HH:mm:ss").format("h:mm A");
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  return (
    <div className='UserAttended'>
      <h1>Your Scheduled Events</h1>
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
                  {event.title} - {formatDate(event.date)} | {formatTime(event.time)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Your Role:</strong> {event.role}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Activity:</strong> {event.activity}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Location:</strong> {event.location}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>School:</strong> {event.school_name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Channel:</strong> {event.channel}
                </Typography>
                <Typography variant="body2">
                  <strong>Notes:</strong> {event.notes}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <h4>No upcoming events found</h4>
        )}
      </div>
    </div>
  );
}

export default UserAttended;