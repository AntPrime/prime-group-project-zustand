import axios from 'axios';

const createAdminSlice = (set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  // Fetch all users (admin only)
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/user/all');
      set({ users: data, isLoading: false });
    } catch (err) {
      console.log('fetchUsers error:', err);
      set({ error: 'Failed to fetch users', isLoading: false });
    }
  },

  // Create new user with admin privileges
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/api/user/register', userData);
      // Refetch users to update the list
      await get().fetchUsers();
      set({ isLoading: false });
    } catch (err) {
      console.log('createUser error:', err);
      set({ error: 'Failed to create user', isLoading: false });
      throw err;
    }
  },

  // Update user admin status (super admin only)
  updateUserStatus: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`/api/user/${id}`, userData);
      // Update the local state to reflect changes
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...userData } : user
        ),
        isLoading: false
      }));
    } catch (err) {
      console.log('updateUserStatus error:', err);
      set({ error: 'Failed to update user status', isLoading: false });
      throw err;
    }
  },

  // Delete user (super admin only)
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/user/${id}`);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        isLoading: false
      }));
    } catch (err) {
      console.log('deleteUser error:', err);
      set({ error: 'Failed to delete user', isLoading: false });
      throw err;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
});

export default createAdminSlice; 