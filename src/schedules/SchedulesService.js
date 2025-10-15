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
}

export default new SchedulesService();
