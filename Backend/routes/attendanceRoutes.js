import { Router } from "express";
import { auth, isOffice } from "../middleware/auth.js";
import { markAttendance, todayOverview, monthlyDetail } from "../controllers/attendanceController.js";

const router = Router();
router.post("/mark", auth, markAttendance);
router.get("/today", auth, isOffice, todayOverview);
router.get("/monthly/:id", auth, isOffice, monthlyDetail);

export default router;
