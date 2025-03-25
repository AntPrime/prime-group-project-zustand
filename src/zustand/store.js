import { create } from "zustand";
import userSlice from './slices/user.slice.js';
import adminSlice from './slices/admin.slice.js';
import categoriesSlice from './slices/categories.slice.js';
import eventsSlice from './slices/events.slice.js';

// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...adminSlice(...args),
  ...categoriesSlice(...args),
  ...eventsSlice(...args),
}))


export default useStore;
