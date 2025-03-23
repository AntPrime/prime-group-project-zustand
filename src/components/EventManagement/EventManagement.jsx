// A component for admin event management:
// Fetches events from GET /api/events/admin, provides a local search

import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';

function EventManagement() {
  const user = useStore((state) => state.user);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = () => {
    axios
      .get('/api/events/admin', { withCredentials: true }) // admin-only route
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = () => {
    // For a real app, we might do server-side search
    if (!searchTerm.trim()) {
      fetchEvents();
    } else {
      const filtered = events.filter((ev) =>
        ev.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEvents(filtered);
    }
  };

  return (
    <div>
      <h2>Event Management</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search by event title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul>
        {events.map((ev) => (
          <li key={ev.id}>
            {ev.title} — {ev.date} — {ev.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventManagement;


//Ensure  back-end has a route like GET /api/events/admin that returns all events for admin usage.
//Add forms or buttons for creating, updating, or deleting events as needed 
// And (POST /api/events/admin, PUT /api/events/admin/:id, etc.).