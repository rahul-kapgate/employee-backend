import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dob: {
    type: Date,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Intern", "Contract"],
    default: "Full-Time",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Terminated"],
    default: "Active",
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const employee = mongoose.model("Employee", employeeSchema);
export default employee;
