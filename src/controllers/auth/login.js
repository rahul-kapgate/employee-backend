import User from "../../models/User/User.model.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials: user not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    // ✅ Compare plain text password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials: password does not match",
        errorCode: "INVALID_PASSWORD",
      });
    }

    // Generate JWT token and send response
    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
        fname: user.fname,
        lname: user.lname,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
