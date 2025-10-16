import AppointmentModel from "./AppointmentsModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";
import { Op, fn, col, where, literal } from "sequelize";
import UserModel from "../user/UserModel.js"; //
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
      // ADICIONE ESTE BLOCO PARA INCLUIR OS DADOS DO DOUTOR
      {
        model: UserModel,
        as: 'doctor',
        attributes: ['id', 'username'] // Pega apenas o ID e o nome de usuário
      }
    ],
    where: literal(`"appointments"."id" IS NULL`),
  });
  return schedules;
}

  async getScheduleById(id) {
    const schedule = await SchedulesModel.findByPk(id);
    return schedule;
  }

  async findByDoctorId(doctorId) {
        try {
            const appointments = await AppointmentModel.findAll({
                where: { doctorId },
                include: [
                    {
                        model: UserModel,
                        as: 'patient',
                        attributes: ['id', 'username', 'email'] // Pega apenas dados essenciais do paciente
                    }
                ],
                order: [['date', 'ASC'], ['startTime', 'ASC']] // Ordena por data e hora
            });
            return appointments;
        } catch (error) {
            throw new Error("Erro no repositório ao buscar agendamentos: " + error.message);
        }
    }
}
export default new AppointmentsRepository();
