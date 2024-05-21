const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  loginUser,
  createUser,
  deleteUser
} = require("../controllers/UserController.js");
router.post("/", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/createUser", createUser);
router.delete("/:id", deleteUser);

module.exports = router;
