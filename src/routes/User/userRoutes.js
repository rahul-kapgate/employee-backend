import expess from "express";
import { createUser } from "../../controllers/User/userController.js";

const router = expess.Router();

//POST api/user
router.post("/", createUser);

export default router