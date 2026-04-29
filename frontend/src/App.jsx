import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4001/api/health")
      .then((response) => {
        setHealth(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Bug Tracker / Mini Jira</h1>
      <p>Frontend is running.</p>

      <h2>Backend Health Check</h2>

      {health && (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      )}

      {error && (
        <p style={{ color: "red" }}>
          Backend connection failed: {error}
        </p>
      )}
    </main>
  );
}

export default App;