import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import sequelize from "./database/database.js";
import appConfig from "./config/app.js";
import logger from "./shared/logger.js  ";
import authRouter from "./routes/authRouter.js";
import adminRouter from "./routes/adminRouter.js";
import secretaryRouter from "./routes/secretaryRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_PREFIX = '/api/v1';
app.use(API_PREFIX, authRouter)
app.use(API_PREFIX, adminRouter);
app.use(API_PREFIX, secretaryRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

sequelize.authenticate()
  .then(() => logger.info("Database connected..."))
  .catch((err) => logger.error("Error: " + err));

const server = http.createServer(app);

const PORT = appConfig.port || 3000;
server.listen(PORT, () => {
  logger.info(`Server running in ${appConfig.env} mode on port ${PORT}`);
});
