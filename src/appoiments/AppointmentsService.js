import AppointmentsRepository from "./AppointmentsRepository.js";
const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class AppointmentsService {
  async listSchedules() {
   try {
      const users = await AppointmentsRepository.getSchedulesAvailable();

      const output = users.map((user) => ({
        ...user.dataValues, 
        links: {
          update: `${baseUrl}${API_PREFIX}/appointments/create/${user.id}`,
        },
      }));

      return output;
    } catch (error) {
      throw new Error("Erro ao listar os usuários: " + error.message);
    }

  }
}
export default new AppointmentsService