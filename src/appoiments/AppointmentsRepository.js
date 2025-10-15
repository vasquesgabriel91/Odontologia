import AppointmentModel from "./AppointmentsModel.js";
import SchedulesModel from "../schedules/SchedulesModel.js";
import { Op, fn, col, where, literal } from "sequelize";

class AppointmentsRepository {
  async getSchedulesAvailable() {
    const schedules = await SchedulesModel.findAll({
      include: [
        {
          model: AppointmentModel,
          as: "appointments",
          required: false, // LEFT JOIN
          where: {
            status: {
              [Op.in]: ["agendado", "concluído", "cancelado"],
            },
          },
        },
      ],
      where: literal(`"appointments"."id" IS NULL`),
    });

    return schedules;
  }
}
export default new AppointmentsRepository();
