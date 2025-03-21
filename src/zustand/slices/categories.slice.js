import axios from 'axios';

const createCategoriesSlice = (set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/categories');
      set({ categories: data, isLoading: false });
    } catch (err) {
      console.log('fetchCategories error:', err);
      set({ error: 'Failed to fetch categories', isLoading: false });
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/categories', categoryData);
      set((state) => ({ 
        categories: [...state.categories, data], 
        isLoading: false 
      }));
      return data;
    } catch (err) {
      console.log('createCategory error:', err);
      set({ error: 'Failed to create category', isLoading: false });
      throw err;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(`/api/categories/${id}`, categoryData);
      set((state) => ({ 
        categories: state.categories.map(category => category.id === id ? data : category),
        isLoading: false 
      }));
      return data;
    } catch (err) {
      console.log('updateCategory error:', err);
      set({ error: 'Failed to update category', isLoading: false });
      throw err;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/categories/${id}`);
      set((state) => ({ 
        categories: state.categories.filter(category => category.id !== id),
        isLoading: false 
      }));
    } catch (err) {
      console.log('deleteCategory error:', err);
      set({ error: err.response?.data?.message || 'Failed to delete category', isLoading: false });
      throw err;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
});

export default createCategoriesSlice; 