import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Admin creates employees
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "employee" });
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const listEmployees = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" }).select("_id name email createdAt");
    res.json(users);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const setOfficeLocation = async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters } = req.body;
    const officeId = req.user.id;
    const updated = await User.findByIdAndUpdate(officeId, { officeLocation: { latitude, longitude, radiusMeters } }, { new: true });
    res.json({ success: true, office: updated });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
