const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");

const app = express();

// Middleware
app.use(cors()); // Allow CORS for frontend apps like GitHub Pages
app.use(express.json());

// Routes
app.use("/", indexRouter);
// @TODO ADD THE USER ENDPOINTS TO USER.JS
app.use("/users/", userRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT}");
});

module.exports = app;
