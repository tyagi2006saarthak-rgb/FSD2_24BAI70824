import React, { useState } from 'react';
import { usePosts } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PLATFORMS = [
  '📷 Instagram',
  '📘 Facebook',
  '💼 LinkedIn',
  '🐦 X (Twitter)',
  '▶ YouTube',
];

const PostForm = () => {
  const { addPost } = usePosts();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(DEFAULT_PLATFORMS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addPost({ title: title.trim(), platform, author: user?.username });
    setTitle('');
    setPlatform(DEFAULT_PLATFORMS[0]);
  };

  return (
    <div className="glass-panel post-form" style={{ marginBottom: '1rem' }}>
      <h3>Create Post</h3>
      <form onSubmit={handleSubmit} className="post-form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" className="input-field" />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input-field">
          {DEFAULT_PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn">Publish Post</button>
          <button type="button" className="btn ghost" onClick={() => { setTitle(''); setPlatform(DEFAULT_PLATFORMS[0]); }}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
