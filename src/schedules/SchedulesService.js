import SchedulesRepository from "./SchedulesRepository.js";

class SchedulesService {
  async createSchedules(schedulesData, idUser) {
    const finalData = {
      ...schedulesData,
      doctorId: idUser,
    };

    const newSchedule = await SchedulesRepository.create(finalData);
    return newSchedule;
  }
  async getMySchedules(idUser) {
    try {
      const mySchedules = await SchedulesRepository.findById(idUser);
      return mySchedules;
    } catch (error) {
      throw new Error("Erro ao listar os usuários: " + error.message);
    }
  }
  async getMyAppointments(id) {
    try {
      const myAppointments = await SchedulesRepository.findAppointmentsByDoctorId(id);
      const output = myAppointments.map((appointment) => ({
        ...appointment,
        link: {
          href: `http://localhost:3000/appointments/${appointment.id}`,
        },
      }));
      
      return output;
    } catch (error) {
      throw new Error("Erro ao listar os agendamentos: " + error.message);
    }
  }
}

export default new SchedulesService();
