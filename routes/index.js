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

module.exports = router;
