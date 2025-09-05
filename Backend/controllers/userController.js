import User from "../models/User.js";

export const me = async (req, res) => {
  const u = await User.findById(req.user.id).lean();
  if (!u) return res.status(404).json({ message: "Not found" });
  res.json({ user: u });
};

export const listEmployees = async (req, res) => {
  const employees = await User.find({ role: "employee" }).lean();
  res.json({ employees });
};

export const addEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password, role: "employee" });
    await user.save();
    res.json({ success: true, message: "Employee added" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const setOfficeLocation = async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { officeLocation: { latitude, longitude, radiusMeters } },
      { new: true }
    );
    res.json({ success: true, officeLocation: updated.officeLocation });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
