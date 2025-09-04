import { Router } from "express";
import { auth, isOffice } from "../middleware/auth.js";
import { applyLeave, listLeavesAdmin, approveLeave, rejectLeave } from "../controllers/leaveController.js";

const router = Router();
router.post("/apply", auth, applyLeave);
router.get("/admin", auth, isOffice, listLeavesAdmin);
router.patch("/:id/approve", auth, isOffice, approveLeave);
router.patch("/:id/reject", auth, isOffice, rejectLeave);

export default router;
