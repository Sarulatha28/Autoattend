// backend/models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // Basic details
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: String,
    employeeId: { type: String, required: true, unique: true },
    companyId: { type: String, required: true, index: true },

    // Personal details
    age: Number,
    gender: String,
    dob: Date,
    joiningDate: Date,
    aadhaar: String,
    bankAccNum: String,
    ifscCode: String,
    phone: String,
    photo: String, // store URL/path of uploaded photo

    // Device + Location
    deviceId: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lon, lat]
    },
    assignedLocation: {
      lat: Number,
      lng: Number,
      radiusMeters: Number,
    },

    // Attendance-related
    lastSeenAt: Date,
    insideCount: { type: Number, default: 0 },
    isInside: { type: Boolean, default: false },

    // Created time
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add 2dsphere index for geo queries
employeeSchema.index({ location: "2dsphere" });

export default mongoose.model("Employee", employeeSchema);
