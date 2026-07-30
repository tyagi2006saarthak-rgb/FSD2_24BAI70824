import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/posts/postSlice";

function PostForm() {

  const dispatch = useDispatch();

  const platforms = useSelector(
    (state) => state.platforms.platforms
  );

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!title.trim()) return;

    dispatch(
      addPost({
        id: Date.now(),
        title,
        platform,
        liked: false,
        date: new Date().toLocaleString(),
      })
    );

    setTitle("");
    setPlatform(platforms[0]);
  };

  return (
    <div className="card">

      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {platforms.map((item, index) => (
            <option key={index}>
              {item}
            </option>
          ))}
        </select>

        <button type="submit">
          Publish Post 🚀
        </button>

      </form>

    </div>
  );
}

export default PostForm;