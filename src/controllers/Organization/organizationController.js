import bcrypt from "bcrypt";
import Organization from "../../models/organization/Organization.model.js";
import { storeOtp, getOtpData } from "../../utils/otpStore.js";
import { sendOtpToEmail } from "../../utils/emailService.js";
import User from "../../models/User/User.model.js";
// 1. Initiate Organization Signup (generate OTP, hash password, store in Redis)
export const initiateOrgSignup = async (req, res) => {
  const {
    orgName,
    industry,
    orgSize,
    email,
    phone,
    address,
    contactPerson,
    website,
    password,
    additionalNotes,
  } = req.body;

  if (!orgName || !email || !phone || !contactPerson?.name || !password) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store data + OTP in Redis
    await storeOtp(email, {
      orgName,
      industry,
      orgSize,
      email,
      phone,
      address,
      contactPerson,
      website,
      password: hashedPassword,
      additionalNotes,
      otp,
    });

    // Send OTP to email
    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to organization email" });
  } catch (err) {
    console.error("❌ initiateOrgSignup error:", err);
    res.status(500).json({ message: "Failed to initiate signup" });
  }
};

// 2. Verify OTP & Create Organization and Admin
export const verifyOrgOtpAndCreate = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const orgData = await getOtpData(email, otp);

    if (!orgData) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Check if org already exists
    const existingOrg = await Organization.findOne({
      $or: [{ email }, { phone: orgData.phone }],
    });

    if (existingOrg) {
      return res.status(409).json({ message: "Organization already exists" });
    }

    // Create Organization
    const newOrg = new Organization({
      orgName: orgData.orgName,
      industry: orgData.industry,
      orgSize: orgData.orgSize,
      email: orgData.email,
      phone: orgData.phone,
      address: orgData.address,
      contactPerson: orgData.contactPerson,
      website: orgData.website,
      password: orgData.password,
      additionalNotes: orgData.additionalNotes,
    });

    const savedOrg = await newOrg.save();

    // ✅ Create User with admin role
    const adminUser = new User({
      name: orgData.contactPerson.name,
      email: orgData.email,
      phone: orgData.phone,
      password: orgData.password,
      role: "admin",
      organizationId: savedOrg._id,
    });

    await adminUser.save();

    res.status(201).json({
      message: "Organization and admin user created successfully",
      organizationId: savedOrg._id,
      adminEmail: adminUser.email,
    });
  } catch (err) {
    console.error("❌ verifyOrgOtpAndCreate error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};


// 3. Get all organizations (for admin panel)
export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().select("-password");
    res.status(200).json(orgs);
  } catch (err) {
    console.error("❌ getAllOrganizations error:", err);
    res.status(500).json({ message: "Failed to fetch organizations" });
  }
};

// 4. Get organization by ID
export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).select("-password");
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json(org);
  } catch (err) {
    console.error("❌ getOrganizationById error:", err);
    res.status(500).json({ message: "Failed to fetch organization" });
  }
};

// 5. Update organization (excluding password update)
export const updateOrganization = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password;

    const updatedOrg = await Organization.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ message: "Organization updated", org: updatedOrg });
  } catch (err) {
    console.error("❌ updateOrganization error:", err);
    res.status(500).json({ message: "Failed to update organization" });
  }
};

// 6. Delete organization by ID
export const deleteOrganization = async (req, res) => {
  try {
    const deletedOrg = await Organization.findByIdAndDelete(req.params.id);
    if (!deletedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json({ message: "Organization deleted" });
  } catch (err) {
    console.error("❌ deleteOrganization error:", err);
    res.status(500).json({ message: "Failed to delete organization" });
  }
};
