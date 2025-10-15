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
}

export default new AppointmentsUseCase;