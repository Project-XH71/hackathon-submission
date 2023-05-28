import config from "./config.json";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching user data from API
export const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
  const response = await axios.post(`${process.env.API_URL}/user/info`);
  const response1 = await axios.get(`${process.env.API_URL}/user/getmyroles`);
  return {
    ...response.data,
    roles: response1.data.roles,
  };
});

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;