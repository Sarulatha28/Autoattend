import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  employeeId: { type: String, required: true },
  companyId: { type: String, required: true },
  age: Number,
  gender: String,
  dob: Date,
  joiningDate: Date,
  aadhaar: String,
  bankAccNum: String,
  ifscCode: String,
  photo: String // store URL/path of uploaded photo
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
