import Employee from "../../models/User/employe.model.js";

export const employeSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      dob,
      department,
      designation,
      dateOfJoining,
      employmentType,
      status,
      address,
      organization,
    } = req.body;

    // Basic required field validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !gender ||
      !dob ||
      !department ||
      !dateOfJoining ||
      !organization
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check for existing employee by email or phone
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingEmployee) {
      return res
        .status(409)
        .json({ message: "Employee with this email or phone already exists" });
    }

    // Auto-generate employeeId (e.g., EMP20250530-XYZ123)
    const uniqueSuffix = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();
    const employeeId = `EMP${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${uniqueSuffix}`;

    // Create new employee document
    const newEmployee = new Employee({
      employeeId,
      fullName,
      email,
      phone,
      gender,
      dob,
      department,
      designation,
      dateOfJoining,
      employmentType,
      status,
      address,
      organization,
    });

    // Save to DB
    await newEmployee.save();

    return res
      .status(201)
      .json({
        message: "Employee created successfully",
        employee: newEmployee,
      });
  } catch (error) {
    console.error("Error in initiateEmpSignup:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not create employee." });
  }
};
