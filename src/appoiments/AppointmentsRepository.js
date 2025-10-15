import AppointmentModel from "./AppointmentsModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";
import { Op, fn, col, where, literal } from "sequelize";
class AppointmentsRepository {
  async createAppointments(
    startTime,
    endTime,
    status,
    scheduleId,
    patientId,
    doctorId,
    secretaryId,
    date
  ) {
    try {
      const appointment = await AppointmentModel.create({
        startTime,
        endTime,
        status,
        scheduleId,
        patientId,
        doctorId,
        secretaryId,
        date,
      });

      return appointment;
    } catch (error) {
      throw new Error("Erro ao criar agendamento: " + error.message);
    }
  }
  async getSchedulesAvailable() {
    const schedules = await SchedulesModel.findAll({
      include: [
        {
          model: AppointmentModel,
          as: "appointments",
          required: false,
          where: {
            status: {
              [Op.in]: ["agendado", "concluído", "cancelado"],
            },
          },
        },
      ],
      where: literal(`"appointments"."id" IS NULL`),
    });

    return schedules;
  }

  async getScheduleById(id) {
    const schedule = await SchedulesModel.findByPk(id);
    return schedule;
  }
}
export default new AppointmentsRepository();
