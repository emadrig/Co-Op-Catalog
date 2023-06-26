import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('token') || '';

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload);  // save token to local storage
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
