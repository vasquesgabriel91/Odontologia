import AppointmentModel from "./AppointmentsModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";
import User from "../user/UserModel.js";
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
      include: [
        {
          model: AppointmentModel,
          as: "appointments",
          required: false,
          attributes: ["startTime"],
          where: {
            status: {
              [Op.in]: ["agendado", "concluído", "cancelado"],
            },
          },
        },
      ],
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

  async getAppointmentById(id) {
    const appointment = await AppointmentModel.findByPk(id);
    return appointment;
  }

  async getAllAppointmentsDetailed(dateFormate) {
    const appointments = await AppointmentModel.findAll({
      include: [
        {
          model: User,
          as: "patient",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: SchedulesModel,
          as: "schedule",
          required: true,
          attributes: [], 
          where: {
            dateOfWeek: {
              [Op.gte]: dateFormate,
            },
          },
        },
      ],
    });

    return appointments.map((app) => app.toJSON());
  }

  async updateDateOfWeek(scheduleId, dateOfWeek, dayOfWeek) {
    const appointment = await SchedulesModel.update(
      { dateOfWeek, dayOfWeek },
      { where: { id: scheduleId } }
    );
    return appointment;
  }

  async updateAppointment(appointmentId, date, startTime, endTime, status) {
    const appointment = await AppointmentModel.update(
      { date, startTime, endTime, status },
      { where: { id: appointmentId } }
    );

    const getAppointmentById = await this.getAppointmentById(appointmentId);

    return getAppointmentById;
  }
}
export default new AppointmentsRepository();