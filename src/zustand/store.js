import { create } from "zustand";
import userSlice from './slices/user.slice.js'
import eventsSlice from './slices/events.slice.js'

// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
  ...eventsSlice(...args),
}))


export default useStore;
