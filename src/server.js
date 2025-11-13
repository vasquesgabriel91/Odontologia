import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import sequelize from "./database/DatabaseSingleton.js";
import appConfig from "./config/app.js";
import logger from "./shared/logger.js  ";
import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRouter.js";
import secretaryRouter from "./routes/secretaryRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import clientRouter from "./routes/clientRouter.js";
import "./models/addressAssociation.js";

dotenv.config();
const API_PREFIX = process.env.API_PREFIX;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_PREFIX, authRouter);
app.use(API_PREFIX, adminRouter);
app.use(API_PREFIX, secretaryRouter);
app.use(API_PREFIX, doctorRouter);
app.use(API_PREFIX, clientRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

sequelize
  .authenticate()
  .then(() => logger.info("Database connected..."))
  .catch((err) => logger.error("Error: " + err));

const server = http.createServer(app);

const PORT = appConfig.port || 3000;
server.listen(PORT, () => {
  logger.info(`Server running in ${appConfig.env} mode on port ${PORT}`);
});
