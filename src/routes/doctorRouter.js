import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import SchedulesController from "../schedules/SchedulesController.js";
const router = express.Router();

router.post("/schedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.createSchedules);
router.get("/mySchedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.getMySchedules);
router.post("/schedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.createSchedules);
router.get("/getMyAppointments",authMiddleware, checkRoles(["doctor"]), SchedulesController.getMyAppointments);

export default router;