import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "office"], required: true },
    // officeLocation only used for office accounts
    officeLocation: {
      latitude: Number,
      longitude: Number,
      radiusMeters: { type: Number, default: 100 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
