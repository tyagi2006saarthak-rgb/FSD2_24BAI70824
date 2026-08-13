import React, { createContext, useContext, useEffect, useState } from 'react';

const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem('posts');
      const parsed = raw ? JSON.parse(raw) : [];
      // migrate old posts that used `liked` boolean to `likedBy` array
      return parsed.map((p) => ({
        ...p,
        likedBy: p.likedBy || (p.liked ? [] : p.likedBy || []),
      }));
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {}
  }, [posts]);

  const addPost = ({ title, platform, author }) => {
    const p = {
      id: Date.now(),
      title,
      platform,
      author: author || 'Anonymous',
      likedBy: [],
      date: new Date().toLocaleString(),
    };
    setPosts((s) => [p, ...s]);
  };

  const editPost = ({ id, title, platform }) => {
    setPosts((s) => s.map((p) => (p.id === id ? { ...p, title, platform } : p)));
  };

  const deletePost = (id) => {
    setPosts((s) => s.filter((p) => p.id !== id));
  };

  // toggle like by username; if username not provided, do nothing
  const toggleLike = (id, username) => {
    if (!username) return;
    setPosts((s) =>
      s.map((p) => {
        if (p.id !== id) return p;
        const likedBy = Array.isArray(p.likedBy) ? p.likedBy.slice() : [];
        const idx = likedBy.indexOf(username);
        if (idx === -1) likedBy.push(username);
        else likedBy.splice(idx, 1);
        return { ...p, likedBy };
      })
    );
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, editPost, deletePost, toggleLike }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
