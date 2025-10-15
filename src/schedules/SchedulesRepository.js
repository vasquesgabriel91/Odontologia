import SchedulesModel from "./SchedulesModel.js";

class SchedulesRepository {
  async create(finalData) {
    const createSchedules = await SchedulesModel.create(finalData);
    return createSchedules;
  }
  async findById(idUser) {
    const getSchedules = await SchedulesModel.findAll({
      where: { doctorId: idUser },
    });
    return getSchedules;
  }
}
export default new SchedulesRepository();
