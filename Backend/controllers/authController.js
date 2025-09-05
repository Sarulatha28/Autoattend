import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Company signup
export const signupCompany = async (req, res) => {
  const { companyName, companyEmail, companyPassword } = req.body;
  try {
    const exists = await User.findOne({ email: companyEmail });
    if (exists) return res.status(400).json({ message: "Company already exists" });

    const hashedPassword = await bcrypt.hash(companyPassword, 10);
    await User.create({
      name: companyName,
      email: companyEmail,
      password: hashedPassword,
      role: "admin", // Admin role
    });
    res.json({ message: "Company registered successfully", role: "admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employee signup
export const signupEmployee = async (req, res) => {
  const { employeeName, employeeEmail, employeePassword, employeePhone } = req.body;
  try {
    const exists = await User.findOne({ email: employeeEmail });
    if (exists) return res.status(400).json({ message: "Employee already exists" });

    const hashedPassword = await bcrypt.hash(employeePassword, 10);
    await User.create({
      name: employeeName,
      email: employeeEmail,
      password: hashedPassword,
      phone: employeePhone,
      role: "employee",
    });
    res.json({ message: "Employee registered successfully", role: "employee" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Signin for both roles
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Signin successful", role: user.role, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
