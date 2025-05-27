import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee",
  },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
});


const User = mongoose.model("User", userSchema);
export default User;
