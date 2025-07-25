// filepath: c:\Users\dahun\Downloads\varanames-main\varanames-main\backend\server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

console.log("Server file is running...");

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
const registeredNames = [
  { id: 1, name: "john.vara" },
  { id: 2, name: "jane.vara" },
  { id: 3, name: "doe.vara" },
];

// API Endpoints
app.get("/registered-names", (req, res) => {
  res.json(registeredNames);
});

app.get("/search", (req, res) => {
  const query = req.query.query?.toLowerCase();
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const results = registeredNames.filter((name) =>
    name.name.toLowerCase().includes(query)
  );
  res.json(results);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});