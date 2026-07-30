import Dashboard from "./components/Dashboard";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import PlatformList from "./components/PlatformList";

function App() {
  return (
    <div className="app">

      <header className="header">
        <h1>📸 Social Post Manager</h1>
        <p></p>
      </header>

      <Dashboard />

      <div className="layout">

        <div className="left">

          <PostForm />

          <PlatformList />

        </div>

        <div className="right">

          <PostList />

        </div>

      </div>

    </div>
  );
}

export default App;