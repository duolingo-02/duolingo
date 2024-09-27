// ==============================
// Importing Redux Toolkit and Actions
// ==============================
import { createSlice } from "@reduxjs/toolkit";
import { Language } from "../../types/types"; // Adjust the import path
import { fetchLanguages } from "../actions/languageAction"; // Adjust the import path

// ==============================
// Type Definitions
// ==============================
interface LanguageState {
  languages: Language[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// ==============================
// Initial State
// ==============================
const initialState: LanguageState = {
  languages: [],
  status: "idle",
  error: null,
};

// ==============================
// Language Slice
// ==============================
const languageSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.languages = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch languages";
      });
  },
});

// ==============================
// Export Reducer
// ==============================
export default languageSlice.reducer;
