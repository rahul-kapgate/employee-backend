// FILE: controllers/auth/requestPasswordReset.js
import { storeOtp } from "../../utils/otpStore.js";
import { sendOtpToEmail } from "../../utils/emailService.js";
import User from "../../models/User/User.model.js";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`📨 Password reset OTP for ${email}: ${otp}`);

    await storeOtp(email, { purpose: "passwordReset", otp });
    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Error requesting password reset:", err);
    res
      .status(500)
      .json({ message: "Server error during password reset request" });
  }
};
