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

module.exports = router;
