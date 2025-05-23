import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpToEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code from Employee App",
    text: `Hello,

Thank you for registering with Employee App. 

Your One-Time Password (OTP) to complete the verification process is:

${otp}

This code is valid for the next 5 minutes. Please do not share this code with anyone.

If you did not request this, please ignore this email.

Best regards,
Employee App Team`,
  };

  await transporter.sendMail(mailOptions);
};
