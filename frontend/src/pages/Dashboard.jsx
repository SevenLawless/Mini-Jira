import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        setError("You must login first");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }

    getCurrentUser();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>Logged in as: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}

export default Dashboard;