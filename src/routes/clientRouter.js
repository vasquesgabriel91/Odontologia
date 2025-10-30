import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import clientController from "../client/ClientController.js";
const router = express.Router();

const allowedClientRoles = ["client", "secretary", "cliente", "Client"];

router.get ( "/getAllMyAppointmentPatient", authMiddleware, checkRoles(allowedClientRoles), clientController.myAppointmentPatient);
router.put ( "/myAppointment/Cancel/:id", authMiddleware, checkRoles(allowedClientRoles), clientController.myAppointmentPatientCancel);

export default router;