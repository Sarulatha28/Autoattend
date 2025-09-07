// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // companyName
    email: { type: String, required: true, unique: true }, // companyEmail
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
