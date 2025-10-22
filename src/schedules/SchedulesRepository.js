import SchedulesModel from "./SchedulesModel.js";
import AppointmentsModel from "../appointments/AppointmentsModel.js";
import UserModel from "../user/UserModel.js";

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
  async findAppointmentsByDoctorId(idUser) {
    const getAppointments = await AppointmentsModel.findAll({
      where: { doctorId: idUser },
      include: [
        {
          model: UserModel,
          as: "patient",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    return getAppointments.map((app) => app.toJSON());
  }
}
export default new SchedulesRepository();
