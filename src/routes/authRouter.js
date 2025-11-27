import express from "express";
import AuthController from "../auth/AuthController.js";
import validateFields from "../middlewares/validateFields.js";

const router = express.Router();

router.post("/login", validateFields(["username", "password"]), AuthController.authenticate);

// --- NOVAS ROTAS ---
router.post("/forgot-password", validateFields(["email"]), AuthController.forgotPassword);
router.post("/reset-password", validateFields(["token", "newPassword"]), AuthController.resetPassword);

export default router;