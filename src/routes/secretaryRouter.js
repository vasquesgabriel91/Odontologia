import express from "express";
import ClientController from "../client/ClientController.js";
import validateFields from "../middlewares/validateFields.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkRoles from "../middlewares/checkRoles.js";

const router = express.Router();

router.post( "/client",authMiddleware, checkRoles(["secretary"]), validateFields(["username","telephone", "email","password"]), ClientController.createClient );

export default router;
