import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import Output from "./components/Output";
import LanguageSelector from "./components/LanguageSelector";
import Login from "./pages/login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <nav className="navbar">
        <h3>
          Welcome,{" "}
          <span style={{ color: "#00bcd4" }}>
            {user.name || "User"}
          </span>
        </h3>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="editor-section">
        <LanguageSelector />
        <CodeEditor />
        <Output />
      </div>
    </div>
  );
}

export default App;
