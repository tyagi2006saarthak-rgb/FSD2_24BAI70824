import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  platforms: [
    "📷 Instagram",
    "📘 Facebook",
    "💼 LinkedIn",
    "🐦 X (Twitter)",
    "▶ YouTube",
  ],
};

const platformSlice = createSlice({
  name: "platforms",

  initialState,

  reducers: {},
});

export default platformSlice.reducer;