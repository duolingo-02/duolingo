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
  async () => {
    const response = await axios.get("http://localhost:1274/api/language/get");

    // Return the array of languages
    return response.data;
  }
);
