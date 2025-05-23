import express from "express";
import { initiateSignup } from "../controllers/auth/initiateSignup.js";
import { verifyOtpAndCreateUser } from "../controllers/auth/verifyOtpAndCreateUser.js";
import { loginUser } from "../controllers/auth/login.js";

const router = express.Router();
router.post("/signup/send-otp", initiateSignup);
router.post("/signup/verify-otp", verifyOtpAndCreateUser);
router.post("/login", loginUser)

export default router;
