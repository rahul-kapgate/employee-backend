import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users - Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Create user
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
