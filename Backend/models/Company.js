// backend/models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: String, required: true, unique: true },
  geofence: {
    center: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    radiusMeters: { type: Number, default: 50 },
  },
});

const Company = mongoose.model("Company", companySchema);
export default Company;
