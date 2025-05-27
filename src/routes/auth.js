import express from "express";
// import { initiateSignup } from "../controllers/auth/initiateSignup.js";
// import { verifyOtpAndCreateUser } from "../controllers/auth/verifyOtpAndCreateUser.js";
import { loginUser, refreshAccessToken } from "../controllers/auth/login.js";
// import { requestPasswordReset } from "../controllers/auth/requestPasswordReset.js";
// import { verifyOtpAndResetPassword } from "../controllers/auth/verifyOtpAndResetPassword.js";

const router = express.Router();
// router.post("/signup/send-otp", initiateSignup);
// router.post("/signup/verify-otp", verifyOtpAndCreateUser);
router.post("/login", loginUser);
// router.get("/refresh-token", refreshAccessToken);
// router.post("/request-password-reset", requestPasswordReset);
// router.post("/reset-password", verifyOtpAndResetPassword);

export default router;
