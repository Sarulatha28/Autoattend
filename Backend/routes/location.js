// backend/routes/location.js
import express from 'express';
import Employee from '../models/Employee.js';
import Company from '../models/Company.js';
import Attendance from '../models/Attendance.js';
import { haversineDistanceMeters } from '../utils/haversine.js';
import { authEmployee } from '../middleware/authEmployee.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const THRESH = Number(process.env.THRESHOLD_INSIDE || 3);

// POST /api/location/update  (employee sends lat, lon)  [auth required]
router.post('/update', authEmployee, async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if(lat == null || lon == null) return res.status(400).json({ msg: 'Missing lat/lon' });

    const emp = req.employee;
    emp.location = { type: 'Point', coordinates: [Number(lon), Number(lat)] };
    emp.lastSeenAt = new Date();

    // find company geofence
    const company = await Company.findOne({ companyId: emp.companyId });
    if(!company || !company.geofence || !company.geofence.center) {
      await emp.save();
      return res.json({ ok: true, inside: false, message: 'No geofence configured' });
    }

    const center = company.geofence.center.coordinates; // [lon,lat]
    const radius = company.geofence.radiusMeters || 50;
    const dist = haversineDistanceMeters(Number(lat), Number(lon), center[1], center[0]);
    const inside = dist <= radius;

    // debouncing to avoid jitter (require THRESH consecutive inside samples)
    if(inside) {
      emp.insideCount = (emp.insideCount || 0) + 1;
    } else {
      emp.insideCount = 0;
    }

    const wasInside = !!emp.isInside;

    // When threshold reached and previously outside -> mark IN
    if(emp.insideCount >= THRESH && !wasInside) {
      emp.isInside = true;
      const attendance = new Attendance({
        employeeId: emp._id,
        companyId: emp.companyId,
        type: 'IN',
        location: { type: 'Point', coordinates: [Number(lon), Number(lat)] }
      });
      await attendance.save();
      // emit socket: company room
      const io = req.app.get('io');
      if(io) {
        io.to(emp.companyId).emit('attendance-event', { employeeId: String(emp._id), name: emp.name, type: 'IN', timestamp: attendance.timestamp });
        io.to(emp.companyId).emit('attendance_update', { employeeName: emp.name, type: 'IN', time: attendance.timestamp });
      }
    }

    // If previously inside and now outside -> mark OUT immediately
    if(!inside && wasInside) {
      emp.isInside = false;
      emp.insideCount = 0;
      const attendance = new Attendance({
        employeeId: emp._id,
        companyId: emp.companyId,
        type: 'OUT',
        location: { type: 'Point', coordinates: [Number(lon), Number(lat)] }
      });
      await attendance.save();
      const io = req.app.get('io');
      if(io) {
        io.to(emp.companyId).emit('attendance-event', { employeeId: String(emp._id), name: emp.name, type: 'OUT', timestamp: attendance.timestamp });
        io.to(emp.companyId).emit('attendance_update', { employeeName: emp.name, type: 'OUT', time: attendance.timestamp });
      }
    }

    await emp.save();

    res.json({ ok: true, inside, distanceMeters: Math.round(dist) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router;
