import express from "express";
import { signupCompany, signupEmployee, signin } from "../controllers/authController.js";

const router = express.Router();

// Signup routes
router.post("/company/signup", signupCompany);
router.post("/employee/signup", signupEmployee);

// **Single signin for both roles**
router.post("/signin", signin);

export default router;
