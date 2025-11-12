import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import SchedulesController from "../schedules/SchedulesController.js";
import ObservationController from "../observationAppointment/ObservationController.js";
import uploadImage from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/schedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.createSchedules);
router.get("/mySchedules",authMiddleware, checkRoles(["doctor"]), SchedulesController.getMySchedules);
router.get("/getMyAppointments",authMiddleware, checkRoles(["doctor"]), SchedulesController.getMyAppointments);
router.post("/appointmentsObservation/:id", authMiddleware, uploadImage.single('image'),checkRoles(["doctor"]), ObservationController.createObservationAppointment);

export default router;