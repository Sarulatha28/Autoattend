import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["company", "employee"], required: true },
  companyName: { type: String },
  companyEmail: { type: String },
  companyPassword: { type: String },
  employeeName: { type: String },
  employeeEmail: { type: String },
  employeePassword: { type: String },
  employeePhone: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
