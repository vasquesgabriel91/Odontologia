import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import clientController from "../client/ClientController.js";
const router = express.Router();

router.get ( "/getMyClient", authMiddleware, checkRoles(["client"]), clientController.getMyProfile);
router.get ( "/getAllMyAppointmentPatient", authMiddleware, checkRoles(["client","secretary"]), clientController.myAppointmentPatient);
router.put ( "/myAppointment/Cancel/:id", authMiddleware, checkRoles(["client","secretary"]), clientController.myAppointmentPatientCancel);

export default router;