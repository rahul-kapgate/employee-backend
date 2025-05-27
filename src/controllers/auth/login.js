import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/User/User.model.js";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Email/Username and password are required" });
  }

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const user = await User.findOne(
      isEmail ? { email: identifier.toLowerCase() } : { username: identifier }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid credentials: user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials: password does not match" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // Store refreshToken in HTTP-only cookie (optional but recommended)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        email: user.email,
        role : user.role,
        
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};


export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
