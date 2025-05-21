import express from "express";
import { createUser } from "../controllers/User/userController.js";
import { loginUser } from "../controllers/User/loginController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
