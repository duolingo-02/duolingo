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
        "/api/login",
        credentials
      );
      console.log("login success", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
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
      const data: any = {};
      for (let [key, value] of formData.entries()) {
        if (key === 'file' && value instanceof File) {
          const reader = new FileReader();
          const fileData = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target?.result);
            reader.readAsDataURL(value);
          });
          data[key] = JSON.stringify({ name: value.name, type: value.type, data: fileData });
        } else {
          data[key] = value;
        }
      }

      const response = await axios.post(
        "/api/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to sign up"
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
