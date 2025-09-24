import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Poll {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
}

interface PollsState {
  polls: Poll[];
  status: "idle" | "loading" | "failed";
}

const initialState: PollsState = {
  polls: [],
  status: "idle",
};

// Fetch polls
export const fetchPolls = createAsyncThunk("polls/fetchPolls", async () => {
  const response = await axios.get("/api/polls/"); // backend endpoint
  return response.data;
});

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.status = "idle";
        state.polls = action.payload;
      });
  },
});

export default pollsSlice.reducer;
