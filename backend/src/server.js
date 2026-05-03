const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api", projectRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Buggy API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    res.json({
      status: "ok",
      database: "connected",
      result: rows[0].result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "not connected",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});