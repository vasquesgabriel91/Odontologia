import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
import clientController from "../client/ClientController.js";

const router = express.Router();

// Defina quem pode acessar (clientes e secretárias podem ver/editar perfil de cliente)
const allowedClientRoles = ["client", "secretary", "cliente", "Client"]; 

// Rotas Antigas
router.get("/getAllMyAppointmentPatient", authMiddleware, checkRoles(allowedClientRoles), clientController.myAppointmentPatient);
router.put("/myAppointment/Cancel/:id", authMiddleware, checkRoles(allowedClientRoles), clientController.myAppointmentPatientCancel);


router.get("/client/profile", authMiddleware, checkRoles(allowedClientRoles), clientController.getProfile);
router.put("/client/profile", authMiddleware, checkRoles(allowedClientRoles), clientController.updateProfile);


export default router;