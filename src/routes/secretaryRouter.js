import express from "express";
import ClientController from "../client/ClientController.js";
import AppointmentsController from "../appoiments/AppointmentsController.js"
import validateFields from "../middlewares/validateFields.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";

const router = express.Router();

router.post( "/client",authMiddleware, checkRoles(["secretary"]), validateFields(["username","telephone", "email", "password"]), ClientController.createClient );
router.get( "/schedules",authMiddleware, checkRoles(["secretary"]), AppointmentsController.listSchedules );
router.post( "/appointments/:id",authMiddleware, checkRoles(["secretary"]), AppointmentsController.createAppointments );

export default router;
