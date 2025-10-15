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
}

export default new SchedulesService();
