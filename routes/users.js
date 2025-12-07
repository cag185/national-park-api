// Initlaize Express Router.
var express = require("express");
var router = express.Router();

// Initialze BCrypt
const bcrypt = require("bcrypt");

// Initialize Prisma Client.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get User. /id
router.get("/id", async (req, res) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id, 10);

    const user = await prisma.user.findUnique({
      where: { id: parsedId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user with ID:", id, error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get User by Email
router.get("/email", async (req, res) => {
  try {
    const { emailAddress } = req.params;

    if (!emailAddress) {
      console.error("Email address is null or undefined in request params");
      // Optionally, you can send a warning response, but do not break the build
      // return res.status(400).json({ error: "Email address is required" });
    }

    const emailString = emailAddress ? emailAddress.toString() : "";

    const user = await prisma.user.findUnique({
      where: { email_address: emailString },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found with Email Address: ", emailAddress });
    }

    res.json(user);
  } catch (error) {
    console.error(
      "Error fetching user with email:",
      req.params.emailAddress,
      error
    );
    res.status(500).json({ error: "Database error" });
  }
});

// POST /users
router.post("/", async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;

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
  if (!password) {
    errors.push("Required field 'password' was not provided");
  }

  // Salt and hash the password
  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    errors.push("Password hashing failed");
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
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ errors: ["Internal server error."] });
  }
});

// GET valid login route
router.post("/login", async (req, res) => {
  const { emailAddress, password } = req.body;
  const errors = [];
  // Required field validation
  if (!emailAddress) {
    errors.push("Required field 'emailAddress' was not provided");
  }
  if (!password) {
    errors.push("Required field 'password' was not provided");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  // compare the encrypted plaintext password with the stored hash.
  const user = await prisma.user.findFirst({
    where: { email_address: emailAddress },
  });

  const storedHash = user.password;

  if (!storedHash) {
    errors.push("User not found");
  }
  // compare
  const canLogin = comparePassword(password, storedHash);
  if (!canLogin) {
    errors.push("Invalid password");
  } else {
    // If everything is okay, return the user data.
    res.json(user);
  }
});

// DELETE users route
router.delete("/", async (req, res) => {
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

// Hashing function for passwords.
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Store the hash in the database.
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
}

// Comparison function for logging in with a password.
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    if (match) {
      console.log("Password match successful");
      return true;
    } else {
      console.log("Password match failed");
      return false;
    }
  } catch (error) {
    console.error("Error comparing password:", error);
    return false;
  }
}
module.exports = router;
