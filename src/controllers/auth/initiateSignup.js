// FILE 1: initiateSignup.js - Hash password here
import { storeOtp } from "../../utils/otpStore.js";
import { sendOtpToEmail } from "../../utils/emailService.js";
import bcrypt from "bcrypt";

export const initiateSignup = async (req, res) => {
  const { fname, lname, email, password } = req.body;

  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`📨 Generated OTP for ${email}: ${otp}`);

    // ✅ Hash password BEFORE storing in Redis
    const hashedPassword = await bcrypt.hash(password, 10);

    await storeOtp(email, { fname, lname, password: hashedPassword, otp });
    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Error during OTP initiation:", err);
    res.status(500).json({ message: "Failed to initiate signup" });
  }
};
