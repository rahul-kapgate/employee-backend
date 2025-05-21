import User from "../../models/User/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Validate input
    if (!mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
