import express from "express";
import AuthController from "../auth/AuthController.js";
import validateFields from "../middlewares/validateFields.js";

const router = express.Router();

router.post("/login", validateFields(["username", "password"]), AuthController.authenticate);

export default router;