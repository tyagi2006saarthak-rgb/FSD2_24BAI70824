import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",

  initialState,

  reducers: {

    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );
    },

    toggleLike: (state, action) => {
      const post = state.posts.find(
        (p) => p.id === action.payload
      );

      if (post) {
        post.liked = !post.liked;
      }
    },

  },
});

export const {
  addPost,
  deletePost,
  toggleLike,
} = postSlice.actions;

export default postSlice.reducer;