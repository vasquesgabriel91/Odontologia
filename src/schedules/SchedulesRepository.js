import SchedulesModel from "./SchedulesModel.js";

class SchedulesRepository {
    async create (finalData){
        const createSchedules = await SchedulesModel.create(finalData);
        return createSchedules;
    }
}
export default new SchedulesRepository;