// ==============================
// Importing Redux Toolkit and Actions
// ==============================
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserProfile,
  updateUserPassword,
  updateUserProfile,
  updateUserProfileWithPicture, // Ajout de l'import pour l'action
} from "../actions/userActions";

// ==============================
// Type Definitions
// ==============================
export interface UserProfile {
  username: string;
  email: string;
  profilePicture: string;
  totalPoints: number;
  passwordHash: string;
}

interface UserState {
  profile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  passwordHash: string | null;
}

// ==============================
// Initial State
// ==============================
const initialState: UserState = {
  profile: null,
  status: "idle",
  error: null,
  passwordHash: null,
};

// ==============================
// Slice Definition
// ==============================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  // Handle async actions in extraReducers
  extraReducers: (builder) => {
    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user profile";
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update user profile";
      });

    // Update User Profile with Picture
    builder
      .addCase(updateUserProfileWithPicture.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfileWithPicture.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = { ...state.profile, ...action.payload }; // Mise à jour de la photo dans le profil
      })
      .addCase(updateUserProfileWithPicture.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to update profile with picture";
      });

    // Update User Password
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.passwordHash = action.payload;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update user password";
      });
  },
});

// ==============================
// Export Reducer
// ==============================
export default userSlice.reducer;
