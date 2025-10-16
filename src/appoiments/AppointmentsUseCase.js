import AppointmentsService from "./AppointmentsService.js";

class AppointmentsUseCase {
  async getAllSchedules() {
    try {
      const schedules = await AppointmentsService.listSchedules();
      return schedules;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
  async createAppointments(scheduleId, secretaryId, appointmentData) {
    try {
      const createAppointments = await AppointmentsService.createAppointments(
        scheduleId,
        secretaryId,
        appointmentData
      );
      return createAppointments;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
  async getAppointmentsByDoctor(doctorId) {
        try {
            const appointments = await AppointmentsService.listAppointmentsByDoctor(doctorId);
            return appointments;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    }
}

export default new AppointmentsUseCase();
