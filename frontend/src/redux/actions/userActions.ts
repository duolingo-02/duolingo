// ==============================
// Importing Redux Toolkit and Axios
// ==============================
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store/store";

// ==============================
// Helper function to get token from state
// ==============================
const getAuthToken = (state: RootState) => state.auth.token;

// ==============================
// Fetch User Profile
// ==============================
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = getAuthToken(state);

      if (!token) {
        return thunkAPI.rejectWithValue("No auth token available");
      }

      const response = await axios.get("http://localhost:1274/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched user profile:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

// ==============================
// Update User Profile
// ==============================
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (updatedData: { username: string; email: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = getAuthToken(state);

      if (!token) {
        return thunkAPI.rejectWithValue("No auth token available");
      }

      const response = await axios.put(
        "http://localhost:1274/api/user/me/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated user profile:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ==============================
// Update User Profile with Picture
// ==============================
export const updateUserProfileWithPicture = createAsyncThunk(
  "user/updateUserProfileWithPicture",
  async (formData: FormData, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = getAuthToken(state);

      if (!token) {
        return thunkAPI.rejectWithValue("No auth token available");
      }

      const response = await axios.put(
        "http://localhost:1274/api/user/me/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated profile with picture:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating profile with picture:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile with picture"
      );
    }
  }
);

// ==============================
// Update User Password
// ==============================
export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (
    updatedData: { currentPassword: string; newPassword: string },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = getAuthToken(state);

      if (!token) {
        return thunkAPI.rejectWithValue("No auth token available");
      }

      console.log("Sending password update request:", updatedData);

      const response = await axios.put(
        "http://localhost:1274/api/user/me/password",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Password updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating password:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);
