// backend/middleware/authEmployee.js
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import dotenv from 'dotenv';
dotenv.config();

export const authEmployee = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({ msg: 'No token' });
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'companyDB');
    const emp = await Employee.findById(payload.id);
    if(!emp) return res.status(401).json({ msg: 'Invalid token' });
    req.employee = emp;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Auth failed', error: err.message });
  }
};
