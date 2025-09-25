import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

interface AuthState {
  user: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  status: "idle",
  error: null,
};

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post("/user-register/", { username, password });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post("/token/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      return { username, access: res.data.access, refresh: res.data.refresh };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    await api.post("/user-logout/", { refresh });
  } catch {
    // ignore server errors
  }
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ username: string; access: string; refresh: string }>) => {
        state.status = "succeeded";
        state.user = action.payload.username;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.status = "idle";
      });
  },
});

export default authSlice.reducer;
