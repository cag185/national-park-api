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

  const errors = [];

  // Required field validation
  if (!firstName) {
    errors.push("Required field 'firstName' was not provided");
  }
  if (!lastName) {
    errors.push("Required field 'lastName' was not provided");
  }
  if (!emailAddress) {
    errors.push("Required field 'emailAddress' was not provided");
  }

  // Early return if basic validation fails
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Email uniqueness check — make sure the field matches your schema (likely `email_address`)
    const existingUser = await prisma.user.findFirst({
      where: {
        email_address: emailAddress,
      },
    });

    if (existingUser) {
      errors.push("Email address already in use");
    }

    // First + Last name combo check — also make sure field names match schema
    const existingNameCombo = await prisma.user.findFirst({
      where: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (existingNameCombo) {
      errors.push(`${firstName} ${lastName} already has an account.`);
    }

    // Early return if logical validation fails
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Proceed to create user
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
    res.status(500).json({ errors: ["Internal server error."] });
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
