import axios from "axios";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import { IoIosArrowDropdown } from "react-icons/io";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import moment from 'moment';
import useStore from '../../zustand/store';

function UserAttended() {
  const [eventList, setEventList] = useState([]);
  const user = useStore((state) => state.user);

  const fetchUserEvents = async () => {
    try {
      const response = await axios.get(`/api/events/attended/registered/${user.id}`);
      setEventList(response.data);
    } catch (err) {
      console.error('Error fetching user events:', err);
      alert('Error loading events');
    }
  };

  const formatDate = (dateString) => moment(dateString).format("MM/DD/YYYY");
  const formatTime = (timeString) => moment(timeString, "HH:mm:ss").format("h:mm A");
  const getDayAbbreviation = (date) => moment(date).format('ddd');
  const getDayNumber = (date) => moment(date).format('D');

  useEffect(() => {
    fetchUserEvents();
  }, []);

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          p: 2,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <h2>YOUR SCHEDULED EVENTS</h2>
      </Paper>

      <Box sx={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        {eventList.length > 0 ? (
          eventList.map((event, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                mb: 0,
                p: 1,
                backgroundColor: '#fff',
                borderRadius: 0,
                width: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Accordion elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<IoIosArrowDropdown />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box
                      sx={{
                        minWidth: '60px',
                        textAlign: 'center',
                        mr: 2,
                        borderRight: '1px solid #ccc',
                        pr: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {getDayAbbreviation(event.date)}
                      </Typography>
                      <Typography variant="h6">{getDayNumber(event.date)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: 1 }}>
                      <Typography component="span" sx={{ pl: 1 }}>
                        {formatDate(event.date)} {formatTime(event.time)}
                      </Typography>
                      <Typography component="h3" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mt: 1, pl: 1 }}>
                        {event.title} {event.activity || "N/A"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, pl: 1 }}>
                        <strong>Streaming Channel:</strong> {event.channel}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, pl: 1, fontWeight: 'normal', fontSize: '0.875rem' }}>
                        <LocationOnIcon sx={{ color: 'red', fontSize: '1rem', mr: 0.5 }} />
                        {event.location || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 3,
                      ml: 8,
                      mr: 8,
                      mb: 4,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Notes:</strong> {event.notes || "N/A"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Your Role:
                    </Typography>
                    <Chip 
                      label={event.role || "No Role Assigned"}
                      color="primary"
                      sx={{ 
                        borderRadius: '20px',
                        borderWidth: '1.5px',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}
                    />
                  </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No upcoming events found
          </Typography>
        )}
      </Box>
    </>
  );
}

export default UserAttended;
