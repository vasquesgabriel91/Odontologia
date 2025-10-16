import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import SchedulesController from "../schedules/SchedulesController.js";
import AppointmentsController from "../appoiments/AppointmentsController.js"; // IMPORTAR


const router = express.Router();

router.post("/schedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.createSchedules);
router.get("/mySchedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.getMySchedules);
router.get("/doctor/appointments", authMiddleware, checkRoles(["doctor"]), AppointmentsController.listDoctorAppointments);
export default router;