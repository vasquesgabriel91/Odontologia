import SchedulesModel from "./SchedulesModel.js";
import { Op } from "sequelize";

class SchedulesRepository {
    async create (finalData){
        const createSchedules = await SchedulesModel.create(finalData);
        return createSchedules;
    }
}
export default new SchedulesRepository;