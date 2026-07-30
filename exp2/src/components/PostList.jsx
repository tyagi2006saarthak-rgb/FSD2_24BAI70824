import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  toggleLike,
} from "../features/posts/postSlice";

function PostList() {

  const posts = useSelector(
    (state) => state.posts.posts
  );

  const dispatch = useDispatch();

  return (

    <div className="card">

      <h2>Recent Posts</h2>

      {posts.length === 0 ? (

        <p>No posts yet.</p>

      ) : (

        posts.map((post) => (

          <div
            className="post-card"
            key={post.id}
          >

            <h3>{post.title}</h3>

            <span className="badge">
              {post.platform}
            </span>

            <small>{post.date}</small>

            <div className="buttons">

              <button
                className="like"
                onClick={() =>
                  dispatch(toggleLike(post.id))
                }
              >
                {post.liked ? "❤️ Liked" : "🤍 Like"}
              </button>

              <button
                className="delete"
                onClick={() =>
                  dispatch(deletePost(post.id))
                }
              >
                🗑 Delete
              </button>

            </div>

          </div>

        ))

      )}

    </div>

  );
}

export default PostList;