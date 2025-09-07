// backend/routes/auth.js
import express from "express";
import { signup, signin } from "../controllers/authController.js";

const router = express.Router();

// Company signup
router.post("/signup", signup);

// Company signin
router.post("/signin", signin);

export default router;
