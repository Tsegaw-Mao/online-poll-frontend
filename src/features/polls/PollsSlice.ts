import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Poll } from "../../interfaces/types"; // Import Poll interface from types

interface PollsState {
  polls: Poll[];
  loading: boolean;
  error?: string;
}

const initialState: PollsState = { polls: [], loading: false };

// Async thunk to fetch polls
export const fetchPolls = createAsyncThunk("polls/fetchPolls", async () => {
  const response = await api.get("/polls/");
  return response.data as Poll[];
});

export const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolls.fulfilled, (state, action: PayloadAction<Poll[]>) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch polls";
      });
  },
});

export default pollsSlice.reducer;
