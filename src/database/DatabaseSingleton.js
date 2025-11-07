import sequelize from "sequelize";
import config from "./config/config.js";
import e from "express";

class DatabaseSingleton {
  static instance;

  constructor() {
    if (DatabaseSingleton.instance) {
      return DatabaseSingleton.instance;
    }
    const env = process.env.NODE_ENV || "development";
    const dbConfig = config[env];

    this.sequelize = new sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: false,
      }
    );
    DatabaseSingleton.instance = this;
  }
  getInstance() {
    return this.sequelize;
  }
}

export default new DatabaseSingleton().getInstance();
