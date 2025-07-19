// Initlaize Express Router.
var express = require("express");
var router = express.Router();

// Initialize Prisma Client.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "Welcome to the API!" });
});

// GET /users
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get User. @TODO.

// POST /users
router.post("/users", async (req, res) => {
  const { firstName, lastName, emailAddress } = req.body;

  // Enforce required fields
  if (!firstName || !lastName || !emailAddress) {
    return res.status(400).json({ error: "Required fields were not provided" });
  }

  // @TODO - validate that email and name combination is not currently in use.

  try {
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email_address: emailAddress,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE users route
router.delete("/users/", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
