import SchedulesModel from "./SchedulesModel.js";
import AppointmentsModel from "../appointments/AppointmentsModel.js";

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
  async findAppointmentsByDoctorId(id) {
    const getAppointments = await AppointmentsModel.findAll({
      where: { doctorId: id },
    });
    return getAppointments.map((app) => app.toJSON());
  }
}
export default new SchedulesRepository();
