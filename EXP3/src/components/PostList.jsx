import React, { useState } from 'react';
import { usePosts } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';

const PostList = () => {
  const { posts, editPost, deletePost, toggleLike } = usePosts();
  const { user } = useAuth();
  const role = user?.role || 'viewer';

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPlatform, setEditPlatform] = useState('');
  const [visibleLikersId, setVisibleLikersId] = useState(null);

  if (!posts || posts.length === 0) {
    return (
      <div className="glass-panel">
        <h3>Recent Posts</h3>
        <p className="text-muted">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel post-list">
      <h3>Recent Posts</h3>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {editingId === post.id ? (
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="input-field" />
                <input value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} className="input-field" />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" onClick={() => {
                    if (!editTitle.trim()) return;
                    editPost({ id: post.id, title: editTitle.trim(), platform: editPlatform.trim() });
                    setEditingId(null);
                  }}>Save</button>
                  <button className="btn ghost" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="post-main">
                  <h4 className="post-title">{post.title}</h4>
                  <div className="post-meta">{post.platform} • {post.author} • {post.date}</div>
                </div>
                <div className="post-actions">
                  {(() => {
                    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
                    const liked = user ? likedBy.includes(user.username) : false;
                    return (
                      <button className="btn ghost" onClick={() => toggleLike(post.id, user?.username)}>{liked ? '❤️' : '🤍'}</button>
                    );
                  })()}

                  {(role === 'editor' || role === 'admin') && <button className="btn" onClick={() => { setEditingId(post.id); setEditTitle(post.title); setEditPlatform(post.platform); }}>Edit</button>}

                  {role === 'admin' && (
                    <>
                      <button className="btn" onClick={() => deletePost(post.id)}>Delete</button>
                      <button className="btn ghost" onClick={() => setVisibleLikersId(visibleLikersId === post.id ? null : post.id)}>
                        View Likes ({(Array.isArray(post.likedBy) ? post.likedBy.length : 0)})
                      </button>
                    </>
                  )}
                </div>
                {visibleLikersId === post.id && (
                  <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: 'rgba(15,23,42,0.03)' }}>
                    <strong>Liked by:</strong>
                    <div style={{ marginTop: 6 }}>
                      {(Array.isArray(post.likedBy) && post.likedBy.length > 0) ? (
                        post.likedBy.map((u, i) => (
                          <div key={i} className="muted-note">{u}</div>
                        ))
                      ) : (
                        <div className="muted-note">No likes yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
