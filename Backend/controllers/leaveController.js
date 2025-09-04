import Leave from "../models/Leave.js";
import User from "../models/User.js";

// POST /api/leaves/apply (auth) -> employee apply
export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || user.role !== "employee") return res.status(403).json({ message: "Employee only" });

    const { fromDate, toDate, reason } = req.body;
    const leave = await Leave.create({ employeeId: userId, employeeName: user.name, fromDate, toDate, reason });
    res.json({ success: true, leave });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/leaves/admin (office only)
export const listLeavesAdmin = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Leave.findByIdAndUpdate(id, { status: "Approved" }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Leave.findByIdAndUpdate(id, { status: "Rejected" }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
