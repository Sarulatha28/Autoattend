import express from "express";
import Employee from "../models/Employee.js";
import multer from "multer";

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Add employee
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    const newEmployee = new Employee({
      ...req.body,
      photo: req.file ? `/uploads/${req.file.filename}` : ""
    });
    await newEmployee.save();
    res.json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all employees
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Get single employee
router.get("/:id", async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.json(employee);
});

export default router;
