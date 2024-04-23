// authslice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userDetails = {
        uid: action.payload.uid,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
        email: action.payload.email,
        // Add other necessary fields
      };
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userDetails = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
