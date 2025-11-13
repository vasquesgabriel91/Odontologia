import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import clientController from "../client/ClientController.js";
const router = express.Router();

<<<<<<< HEAD
const allowedClientRoles = ["client", "secretary", "cliente", "Client"];

router.get ( "/getAllMyAppointmentPatient", authMiddleware, checkRoles(allowedClientRoles), clientController.myAppointmentPatient);
router.put ( "/myAppointment/Cancel/:id", authMiddleware, checkRoles(allowedClientRoles), clientController.myAppointmentPatientCancel);
=======
router.get ( "/getMyUser", authMiddleware, checkRoles(["client"]), clientController.getMyProfile);
router.put ( "/patient/update/:id", authMiddleware, checkRoles(["client"]), clientController.updateUser);
router.get ( "/getAllMyAppointmentPatient", authMiddleware, checkRoles(["client","secretary"]), clientController.myAppointmentPatient);
router.put ( "/myAppointment/Cancel/:id", authMiddleware, checkRoles(["client","secretary"]), clientController.myAppointmentPatientCancel);
>>>>>>> c6569ed0bc3880f7c1c9ca572e5e8e067e90d82a

export default router;