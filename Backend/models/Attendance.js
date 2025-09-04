import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeName: String,
    status: { type: String, enum: ["Present", "Not Marked"], default: "Not Marked" },
    insideOffice: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    location: { latitude: Number, longitude: Number }
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
