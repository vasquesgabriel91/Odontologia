import express from "express";
import AdminController from "../admin/AdminController.js";
import SecretaryController from "../secretary/SecretaryController.js";
import DoctorController from "../doctor/DoctorController.js";
import validateFields from "../middlewares/validateFields.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";
const router = express.Router();

router.post("/admin", authMiddleware, checkRoles(["admin"]),validateFields(["username", "password"]), AdminController.createAdmin);
router.post( "/secretary",authMiddleware, checkRoles(["admin"]), validateFields(["username", "password"]), SecretaryController.createSecretary);
router.post( "/doctor", authMiddleware, checkRoles(["admin"]), validateFields(["username", "password","cro"]), DoctorController.createDoctor);


export default router;