import AppointmentModel from "./AppointmentsModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";
import { Op, fn, col, where, literal } from "sequelize";
class AppointmentsRepository {
  async createAppointments(
    startTime,
    endTime,
    status,
    descricao,
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
        descricao,
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
  async getAllSchedules() {
    const schedules = await SchedulesModel.findAll();
    return schedules;
  }
  async getAllAppointments() {
    const appointments = await AppointmentModel.findAll({
      attributes: ["id", "startTime", "endTime"],
      include: [
        {
          model: SchedulesModel,
          as: "schedule",
          attributes: ["id", "startTime", "endTime"],
        },
      ],
    });
    return appointments.map((app) => app.toJSON());
  }
  async getSchedulesAvailable(schedulesComplete = []) {
    const schedules = await SchedulesModel.findAll({
      model: AppointmentModel,
      as: "appointments",
      required: false,
      where: {
        status: {
          [Op.in]: ["agendado", "concluído", "cancelado"],
        },
      },

      where: {
        id: { [Op.notIn]: schedulesComplete },
      },
    });

    return schedules;
  }

  async getScheduleById(id) {
    const schedule = await SchedulesModel.findByPk(id);
    return schedule;
  }
}
export default new AppointmentsRepository();
