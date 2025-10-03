import express from "express";
import SecretaryController from "../secretary/SecretaryController.js";
import validateFields from "../middlewares/validateFields.js";

const router = express.Router();

router.post( "/secretary", validateFields(["userName", "password"]), SecretaryController.createSecretary);

export default router;
