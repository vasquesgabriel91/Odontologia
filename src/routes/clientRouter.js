import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import clientController from "../client/ClientController.js";

const router = express.Router();

router.get ( "/getMyUser", authMiddleware, checkRoles(["client"]), clientController.getMyProfile);
router.put ( "/patient/update/:id", authMiddleware, checkRoles(["client"]), clientController.updateUser);
router.get ( "/getAllMyAppointmentPatient", authMiddleware, checkRoles(["client","secretary"]), clientController.myAppointmentPatient);
router.put ( "/myAppointment/Cancel/:id", authMiddleware, checkRoles(["client","secretary"]), clientController.myAppointmentPatientCancel);
const allowedClientRoles = ["client", "secretary"]; 

router.get("/client/profile", authMiddleware, checkRoles(allowedClientRoles), clientController.getProfile);
router.put("/client/profile", authMiddleware, checkRoles(allowedClientRoles), clientController.updateProfile);

export default router;