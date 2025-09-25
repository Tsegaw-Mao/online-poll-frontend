// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import pollReducer from "../features/polls/PollsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
