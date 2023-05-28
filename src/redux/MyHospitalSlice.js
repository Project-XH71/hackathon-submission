import config from "./config.json";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching user data from API
export const fetchHospital = createAsyncThunk('hospital/fetchHospital', async (userId) => {
  const response = await axios.get(`${process.env.API_URL}/medical-case/doctor/myhospital`);
  return response.data;
});

// User slice
const hospitalSlice = createSlice({
  name: 'hospital',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospital.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default hospitalSlice.reducer;