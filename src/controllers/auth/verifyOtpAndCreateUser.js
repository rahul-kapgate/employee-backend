import { getOtpData } from "../../utils/otpStore.js";
import User from "../../models/User/User.model.js";

export const verifyOtpAndCreateUser = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    console.log("📩 Verifying OTP for:", email, "OTP:", otp);
    const userData = await getOtpData(email, otp);
    console.log("✅ OTP matched. User data from Redis:", userData);

    if (!userData) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const username =
      userData.fname.toLowerCase() + Date.now().toString().slice(-4);

    // ✅ Password is already hashed - use directly
    const newUser = new User({
      fname: userData.fname,
      lname: userData.lname,
      email,
      username,
      password: userData.password, // Already hashed
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", username });
  } catch (err) {
    console.error("❌ Error verifying OTP or creating user:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};
