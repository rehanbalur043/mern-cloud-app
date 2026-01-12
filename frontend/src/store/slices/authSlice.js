import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AUTH_API_URL =
  process.env.REACT_APP_AUTH_API_URL || "http://localhost:5001/api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", response.data.token);
      // NEW: save role for UI (admin/user)
      if (response.data.user?.role) {
        localStorage.setItem("userRole", response.data.user.role);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/register`, {
        username,
        email,
        password,
        role: role || "user",
      });

      // Save token
      localStorage.setItem("token", response.data.token);
      // NEW: save role
      if (response.data.user?.role) {
        localStorage.setItem("userRole", response.data.user.role);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole"); // NEW: clear role
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
