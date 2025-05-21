import User from "../../models/User/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by mobile or username
    const user = await User.findOne({
      $or: [{ mobile: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials: user not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Entered password:", password);
      console.log("Hashed password in DB:", user.password);
      console.log("Password matched:", isMatch);


      return res.status(401).json({ message: "Invalid credentials: not match" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        mobile: user.mobile
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
