import mongoose from "mongoose";

const officeLocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  radiusMeters: Number,
});

const attendanceRuleSchema = new mongoose.Schema({
  startTime: String,
  endTime: String,
  lateAfter: Number,
  weeklyOff: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "office"], default: "employee" },
  companyName: String,
  address: String,
  officeLocation: officeLocationSchema,
  attendanceRules: attendanceRuleSchema,
});

export default mongoose.model("User", userSchema);
