const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();

// Middleware
app.use(cors()); // Allow CORS for frontend apps like GitHub Pages
app.use(express.json());

// Routes
app.use("/", indexRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
