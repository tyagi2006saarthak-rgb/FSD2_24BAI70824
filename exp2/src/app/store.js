import { configureStore } from "@reduxjs/toolkit";

import postReducer from "../features/posts/postSlice";
import platformReducer from "../features/platforms/platformSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
    platforms: platformReducer,
  },
});