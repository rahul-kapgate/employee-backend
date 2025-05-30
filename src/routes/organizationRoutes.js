import express from "express";
import {
  initiateOrgSignup,
  verifyOrgOtpAndCreate,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/Organization/organizationController.js";
import { employeSignup } from "../controllers/employee/employeeController.js";

const router = express.Router();

router.post("/signup/initiate", initiateOrgSignup);
router.post("/signup/verify", verifyOrgOtpAndCreate);

router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);

router.post("/signup/employee", employeSignup);

export default router;
