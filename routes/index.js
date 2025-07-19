// Initlaize Express Router.
var express = require("express");
var router = express.Router();

// Initialize Prisma Client.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

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

// POST /users
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, emailAddress } = req.body;

  // enforce required fields.
  if (!firstName || !lastName || !emailAddress) {
    return res.status(400).json({ error: "Required fields was not provided" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, emailAddress },
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
