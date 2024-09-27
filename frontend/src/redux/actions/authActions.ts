// ==============================
// Importing Redux Toolkit and Axios
// ==============================
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==============================
// Login Async Thunk
// ==============================
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; passwordHash: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        credentials
      );
      console.log("login success", response.data);
      return response.data; // Assuming response.data contains { token, userId }
    } catch (error: any) {
      console.log("Login error", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// ==============================
// Signup Async Thunk
// ==============================
export const signup = createAsyncThunk(
  "auth/signup",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Register success:", response.data);
      return response.data; // Assuming response.data contains { token, userId }
    } catch (error: any) {
      console.error(
        "Register failed:",
        error.response?.data?.message || "Signup failed"
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);

// ==============================
// Logout Async Thunk
// ==============================
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // console.log("Logged out successfully");
    return;
  } catch (error: any) {
    console.error("Logout error", error);
    return thunkAPI.rejectWithValue("Logout failed");
  }
});
