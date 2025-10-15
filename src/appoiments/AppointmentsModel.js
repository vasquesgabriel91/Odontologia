import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database.js";
import User from "../user/UserModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";

class AppointmentModel extends Model {}

AppointmentModel.init(
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
    secretaryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    scheduleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("agendado", "concluído", "cancelado"),
      defaultValue: "agendado",
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
  }
);

AppointmentModel.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });
AppointmentModel.belongsTo(User, { foreignKey: "patientId", as: "patient" });
AppointmentModel.belongsTo(User, { foreignKey: "secretaryId", as: "secretary" });
AppointmentModel.belongsTo(SchedulesModel, { foreignKey: "scheduleId", as: "schedule" });

User.hasMany(AppointmentModel, { foreignKey: "doctorId", as: "doctorAppointments" });
User.hasMany(AppointmentModel, { foreignKey: "patientId", as: "patientAppointments" });
User.hasMany(AppointmentModel, { foreignKey: "secretaryId", as: "secretaryAppointments" });
SchedulesModel.hasMany(AppointmentModel, { foreignKey: "scheduleId", as: "appointments" });

export default AppointmentModel;
