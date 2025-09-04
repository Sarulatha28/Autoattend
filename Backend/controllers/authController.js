import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      companyName,
      address,
      latitude,
      longitude,
      radiusMeters,
      startTime,
      endTime,
      lateAfter,
      weeklyOff,
    } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashed,
      role,
      ...(role === "office"
        ? {
            companyName,
            address,
            officeLocation: { latitude, longitude, radiusMeters },
            attendanceRules: { startTime, endTime, lateAfter, weeklyOff },
          }
        : {}),
    });

    await user.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ================= SIGNIN =================
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Response
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        address: user.address,
        officeLocation: user.officeLocation,
        attendanceRules: user.attendanceRules,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
