import express from "express";
import AdminController from "../admin/AdminController.js";
import SecretaryController from "../secretary/SecretaryController.js";
import DoctorController from "../doctor/DoctorController.js";
import validateFields from "../middlewares/validateFields.js";

const router = express.Router();

router.post("/admin", validateFields(["username", "password"]), AdminController.createAdmin);
router.post( "/secretary", validateFields(["username", "password"]), SecretaryController.createSecretary);
router.post( "/doctor", validateFields(["username", "password","cro"]), DoctorController.createDoctor);


export default router;