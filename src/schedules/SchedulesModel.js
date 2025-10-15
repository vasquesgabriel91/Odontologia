import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database.js";
import User from "../user/UserModel.js";

class SchedulesModel extends Model {}

SchedulesModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dayOfWeek: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    dateOfWeek: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "08:00:00",
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "16:00:00",
    },
  },
  {
    sequelize,
    modelName: "Schedules",
    tableName: "doctor_schedules",
    timestamps: true,
  }
);

SchedulesModel.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });
User.hasMany(SchedulesModel, { foreignKey: "doctorId", as: "schedules" });

export default SchedulesModel;
