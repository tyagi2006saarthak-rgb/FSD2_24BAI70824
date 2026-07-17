import { useState } from "react";
import "./App.css";

function App() {
  const limits = {
    Twitter: 280,
    Facebook: 63206,
    Instagram: 2200,
    LinkedIn: 3000,
  };

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");

  const limit = limits[platform];
  const remaining = limit - post.length;

  return (
    <div className="container">
      <h1>Social Media Post Composer</h1>

      <label>Select Platform</label>
      <br /><br />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        {Object.keys(limits).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <br /><br />

      <textarea
        rows="8"
        cols="50"
        placeholder="Write your post..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <p>
        Characters: {post.length}/{limit}
      </p>

      {remaining < 0 ? (
        <p style={{ color: "red" }}>Character limit exceeded!</p>
      ) : (
        <p style={{ color: "green" }}>Ready to Publish</p>
      )}

      <button disabled={remaining < 0}>Publish</button>
    </div>
  );
}

export default App;