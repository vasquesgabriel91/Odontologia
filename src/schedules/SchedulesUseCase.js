import SchedulesService from './SchedulesService.js';

class SchedulesUseCase {
  async execute(schedulesData, idUser) {
    try {
      const result = await SchedulesService.createSchedules(schedulesData, idUser);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
}

export default new SchedulesUseCase();
