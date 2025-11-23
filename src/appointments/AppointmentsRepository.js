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

  async getAvailableScheduleByIdAndStartTime(scheduleId, startTime) {
    const schedule = await AppointmentModel.findAll({
      raw: true,
      attributes: ["id","startTime","endTime"],
      where: {
        scheduleId,
        startTime,
      },
    });
    return schedule;
  }

  async getAppointmentByScheduleId(scheduleId) {
    const appointment = await AppointmentModel.findAll({
      where: {
        scheduleId: scheduleId,
      },
    });
    return appointment;
  }

async CheckTheAvailableTimes(scheduleId) {
  const schedule = await SchedulesModel.findOne({
    where: { id: scheduleId },
    attributes: ["id", "startTime", "endTime"],
  }
  );
  return schedule;
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
          attributes: ["id", "doctorId", "startTime", "endTime"],
        },
      ],
    });
    return appointments.map((app) => app.toJSON());
  }
  async getSchedulesAvailable(schedulesComplete = []) {
    const schedules = await SchedulesModel.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
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
        {
          model: User,
          as: "doctor",
          attributes: {
                exclude: ["id","password", "email", "telephone", "role","createdAt","updatedAt"],
          },
        }
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
    const appointment = await AppointmentModel.findByPk(id,{
      raw: true,
    });
    return appointment;
  }

  async getAllAppointmentsDetailed() {
    const appointments = await AppointmentModel.findAll({
      attributes: {
          exclude: ["doctorId","patientId","scheduleId","date","startTime", "endTime","createdAt","updatedAt"],
        },
      include: [
        {
          model: User,
          as: "patient",
          attributes: {
            exclude: ["password","cro","createdAt","updatedAt"],
          },
        },
        {
          model: SchedulesModel,
          as: "schedule",
          required: true,
          attributes: ["id", "doctorId", "startTime", "endTime", "dayOfWeek", "dateOfWeek"],
          include: [
            {
              model: User,
              as: "doctor", 
              attributes: {
                exclude: ["id","password", "email", "telephone", "role","createdAt","updatedAt"],
              },
            },
          ],
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

  async getAppointmentByPatientIdAndScheduleId(patientId, scheduleId) {
    const appointment = await AppointmentModel.findOne({
      where: {
        patientId: patientId,
        scheduleId: scheduleId,
      },
    });
    return appointment;
  }
}
export default new AppointmentsRepository();
