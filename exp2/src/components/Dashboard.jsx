import { useSelector } from "react-redux";

function Dashboard() {
  const posts = useSelector((state) => state.posts.posts);
  const platforms = useSelector((state) => state.platforms.platforms);

  const likedPosts = posts.filter((post) => post.liked).length;

  return (
    <div className="dashboard">

      <div className="dashboard-card">
        <h2>{posts.length}</h2>
        <p>Total Posts</p>
      </div>

      <div className="dashboard-card">
        <h2>{platforms.length}</h2>
        <p>Platforms</p>
      </div>

      <div className="dashboard-card">
        <h2>{likedPosts}</h2>
        <p>Liked Posts ❤️</p>
      </div>

    </div>
  );
}

export default Dashboard;