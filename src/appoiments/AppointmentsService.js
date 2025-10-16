import AppointmentsRepository from "./AppointmentsRepository.js";
import UserRepository from "../user/UserRepository.js";

const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class AppointmentsService {
  async listSchedules() {
    try {
      const users = await AppointmentsRepository.getSchedulesAvailable();

      const output = users.map((user) => ({
        ...user.dataValues,
        links: {
          create: `${baseUrl}${API_PREFIX}/appointments/${user.id}`,
        },
      }));

      return output;
    } catch (error) {
      throw new Error("Erro ao listar os usuários: " + error.message);
    }
  } 
  async createAppointments(scheduleId, secretaryId, appointmentData) {
    try {
      const { email, startTime, endTime, status, descricao } = appointmentData;

      const getByEmail = await UserRepository.findByUserNameOrEmail(email);

      const patientId = getByEmail.id;

      const getScheduleById = await AppointmentsRepository.getScheduleById(
        scheduleId
      );

      const doctorId = getScheduleById.doctorId;

      const date = getScheduleById.dayOfWeek;

      const scheduleStartTime = getScheduleById.startTime;

      const scheduleEndTime = getScheduleById.endTime;

      if (startTime < scheduleStartTime || endTime > scheduleEndTime) {
        throw new Error(
          `Consulta fora do horário da agenda. Disponível: ${scheduleStartTime} - ${scheduleEndTime}`
        );
      }

      const createAppointments =
        await AppointmentsRepository.createAppointments(
          startTime,
          endTime,
          status,
          descricao,
          scheduleId,
          patientId,
          doctorId,
          secretaryId,
          date
        );
      return createAppointments;
    } catch (error) {
      throw new Error("Erro ao criar consulta: " + error.message);
    }
  }
  async listAppointmentsByDoctor(doctorId) {
        try {
            const appointments = await AppointmentsRepository.findByDoctorId(doctorId);
            return appointments;
        } catch (error) {
            throw new Error("Erro ao listar agendamentos do doutor: " + error.message);
        }
    }
}
export default new AppointmentsService();
