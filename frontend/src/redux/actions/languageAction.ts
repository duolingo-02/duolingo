// ==============================
// Importing Redux Toolkit and Axios
// ==============================
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Language } from "../../types/types"; // Importing the Language type

// ==============================
// Fetch Languages Async Thunk
// ==============================
export const fetchLanguages = createAsyncThunk<Language[], void>(
  "languages/fetchLanguages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/languages");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch languages");
    }
  }
);