import { Router } from "express";
import { auth, isOffice } from "../middleware/auth.js";
import { addEmployee, listEmployees, setOfficeLocation, me } from "../controllers/userController.js";

const router = Router();
router.get("/me", auth, me);
router.post("/add-employee", auth, isOffice, addEmployee);
router.get("/employees", auth, isOffice, listEmployees);
router.patch("/office/location", auth, isOffice, setOfficeLocation);

export default router;
