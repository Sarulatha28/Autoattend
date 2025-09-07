// backend/controllers/authController.js
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ================= SIGNUP =================
export const signup = async (req, res) => {
  const { companyName, companyEmail, companyId, password } = req.body;

  try {
    if (!companyName || !companyEmail || !companyId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: companyEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: companyName,
      email: companyEmail,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful", role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SIGNIN =================
export const signin = async (req, res) => {
  const { companyId, email, password } = req.body;

  try {
    if (!companyId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, companyId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Signin successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
