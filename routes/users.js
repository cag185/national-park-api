// routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM test_table");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE user by id (PUT)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  // expecting { "name": "newName" }
  const { name } = req.body;

  // enforce required fields.
  if (!name) {
    return res.status(400).json({ error: "Required 'Name' was not provided" });
  }

  // Define SQL query.
  const sql = "UPDATE test_table SET name = ? WHERE id = ?";
  try {
    const [results] = await db.query(sql, [name, id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE a new user (POST)
router.post("/", async (req, res) => {
  const { firstName, lastName, email } = req.body;

  // enforce required fields.
  if (!firstName || !lastName || !email) {
    return res
      .status(400)
      .json({
        error:
          "Required fields 'firstName', 'lastName', and 'email' were not provided",
      });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO test_table (name) VALUES (?)",
      [name]
    );

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
