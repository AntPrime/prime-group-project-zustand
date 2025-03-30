import axios from 'axios';

const createEventsSlice = (set, get) => ({
  events: [],
  eventDetail: null,
  isLoading: false,
  error: null,

  // Fetch all events
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/events');
      set({ events: data, isLoading: false });
    } catch (err) {
      console.log('fetchEvents error:', err);
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  assignRoles: async (eventId, roleColumn) => {
    try {
        await axios.put("/api/assignRole", { eventId, roleColumn });
        await useEventStore.getState().fetchEvents(); // Refresh events
    } catch (error) {
        console.error("Error assigning role", error);
    }
},

  // Fetch event by id
  fetchEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/events/${id}`);
      set({ eventDetail: data, isLoading: false });
    } catch (err) {
      console.log('fetchEventById error:', err);
      set({ error: 'Failed to fetch event details', isLoading: false });
    }
  },

  // Search events
  searchEvents: async (searchQuery, categoryId) => {
    set({ isLoading: true, error: null });
    try {
      let url = '/api/events/search?';
      
      if (searchQuery) {
        url += `query=${encodeURIComponent(searchQuery)}`;
      }
      
      if (categoryId) {
        url += `${searchQuery ? '&' : ''}category=${categoryId}`;
      }
      
      const { data } = await axios.get(url);
      set({ events: data, isLoading: false });
    } catch (err) {
      console.log('searchEvents error:', err);
      set({ error: 'Failed to search events', isLoading: false });
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/events', eventData);
      set((state) => ({ 
        events: [...state.events, data], 
        isLoading: false 
      }));
      return data;
    } catch (err) {
      console.log('createEvent error:', err);
      set({ error: 'Failed to create event', isLoading: false });
      throw err;
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(`/api/events/${id}`, eventData);
      set((state) => ({ 
        events: state.events.map(event => event.id === id ? data : event),
        eventDetail: data,
        isLoading: false 
      }));
      return data;
    } catch (err) {
      console.log('updateEvent error:', err);
      set({ error: 'Failed to update event', isLoading: false });
      throw err;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/events/${id}`);
      set((state) => ({ 
        events: state.events.filter(event => event.id !== id),
        isLoading: false 
      }));
    } catch (err) {
      console.log('deleteEvent error:', err);
      set({ error: 'Failed to delete event', isLoading: false });
      throw err;
    }
  },

  // Clear event detail
  clearEventDetail: () => {
    set({ eventDetail: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
});

export default createEventsSlice; 