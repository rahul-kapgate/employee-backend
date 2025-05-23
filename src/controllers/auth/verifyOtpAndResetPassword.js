// FILE: controllers/auth/verifyOtpAndResetPassword.js
import { getOtpData } from "../../utils/otpStore.js";
import User from "../../models/User/User.model.js";
import bcrypt from "bcrypt";

export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const data = await getOtpData(email, otp);

    if (!data || data.purpose !== "passwordReset") {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ message: "Server error during password reset" });
  }
};
