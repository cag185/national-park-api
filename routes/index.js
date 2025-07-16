var express = require("express");
var router = express.Router();

/* GET home page. */

// Testing URL.
router.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

router.get("/users", function (req, res, next) {
  // Simulate a user list
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  res.json(users);
});

router.get("/", function (req, res, next) {
  res.json({ message: "Welcome to the API!" });
});

// Route to push a new login attempt.
router.post("/login", function (req, res) {
  // Simulate a login attempt
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    res.json({ message: "Login successful!" });
  } else {
    res.status(401).json({ error: "Invalid login creditials. Try again..." });
  }
});

router.post("/login-attempts", function (req, res) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Invalid request data." });
  }

  // Simulate storing the login attempt
  const loginAttempt = {
    id: Date.now(),
    username,
    timestamp: new Date(),
  };

  // For now, just return the login attempt as a response
  res.status(201).json({ message: "Login attempt recorded.", loginAttempt });
});

module.exports = router;
