import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database.js";
import AppointmentModel from "../appointments/AppointmentsModel.js";

class ObservationModel extends Model {}

ObservationModel.init(
  {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    appointmentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    diagnostic: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    procedures: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    exams: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    recommendations: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
  },
    {
    sequelize,
    modelName: "ObservationAppointment",
    tableName: "ObservationAppointments",
    timestamps: true,
  }
);  
ObservationModel.belongsTo(AppointmentModel, { foreignKey: "appointmentId", as: "appointment" });
AppointmentModel.hasMany(ObservationModel, { foreignKey: "appointmentId", as: "observations" });

export default ObservationModel;



