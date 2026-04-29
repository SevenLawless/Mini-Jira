const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bug Tracker API is running" });
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