const express = require("express");
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const router = express.Router();
const jwt = require("jsonwebtoken")

// Create default admin
router.get("/create-admin", async (req, res) => {
  const check = await User.findOne({ email: "admin@system.com" });
  if (check) return res.json({ message: "Admin already exists" });

  const admin = await User.create({
    name: "admin",
    email: "admin@system.com",
    password: await bcrypt.hash("admin", 10),
    role: "admin",
    userId: 12251,
  });

  res.json({ message: "Admin created", admin });
});

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const lastUser = await User.findOne().sort({ userId: -1 });
  const nextId = lastUser ? lastUser.userId + 1 : 12251;

  const user = await User.create({
    name,
    email,
    password: hashed,
    userId: nextId,
  });

  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: "UserID and password required" });
  }

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(400).json({ message: "Invalid UserID" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//all
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// UPDATE user by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
});


module.exports = router;
