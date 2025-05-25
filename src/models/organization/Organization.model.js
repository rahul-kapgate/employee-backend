import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  orgName: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  orgSize: {
    type: Number,
    min: 1,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  contactPerson: {
    name: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
  },
  website: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
