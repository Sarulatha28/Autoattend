import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// distance in meters (Haversine)
const distanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// POST /api/attendance/mark  (auth)
export const markAttendance = async (req, res) => {
  try {
    // prefer authenticated user id
    const employeeId = req.user?.id || req.body.employeeId;
    const { latitude, longitude } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "employee") return res.status(404).json({ message: "Employee not found" });

    // find office (single office system: assume one office account)
    const office = await User.findOne({ role: "office" });
    if (!office || !office.officeLocation) return res.status(400).json({ message: "Office location not set" });

    const { latitude: oLat, longitude: oLng, radiusMeters } = office.officeLocation;
    const dist = distanceMeters(latitude, longitude, oLat, oLng);
    const inside = dist <= (radiusMeters || 100);

    const status = inside ? "Present" : "Not Marked";

    // only one record per day per employee
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);

    const existing = await Attendance.findOne({ employeeId, timestamp: { $gte: start, $lte: end } });
    if (existing) {
      return res.json({ success: true, already: true, status: existing.status, insideOffice: existing.insideOffice, distance: Math.round(dist) });
    }

    const rec = await Attendance.create({
      employeeId,
      employeeName: employee.name,
      status,
      insideOffice: inside,
      location: { latitude, longitude }
    });

    res.json({ success: true, status: rec.status, insideOffice: rec.insideOffice, distance: Math.round(dist) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/attendance/today  (office only)
export const todayOverview = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("_id name email");

    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);

    const todays = await Attendance.find({ timestamp: { $gte: start, $lte: end } });
    const presentIds = new Set(todays.filter(t => t.status === "Present").map(t => String(t.employeeId)));

    const present = [], absent = [];
    for (const emp of employees) {
      (presentIds.has(String(emp._id)) ? present : absent).push(emp);
    }

    res.json({ present, absent });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/attendance/monthly/:id?month=YYYY-MM  (office only)
export const monthlyDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { month } = req.query; // YYYY-MM

    const base = month ? new Date(`${month}-01T00:00:00`) : new Date();
    const year = base.getFullYear();
    const mon = base.getMonth();

    const start = new Date(year, mon, 1);
    const end = new Date(year, mon + 1, 0, 23, 59, 59, 999);

    const recs = await Attendance.find({ employeeId: id, timestamp: { $gte: start, $lte: end } }).sort({ timestamp: 1 });

    const presentCount = recs.filter(r => r.status === "Present").length;
    const notMarkedCount = recs.length - presentCount;
    const insideDays = recs.filter(r => r.insideOffice).length;
    const outsideDays = recs.filter(r => !r.insideOffice).length;

    res.json({
      month: `${year}-${String(mon+1).padStart(2,"0")}`,
      presentCount, notMarkedCount, insideDays, outsideDays, records: recs
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
