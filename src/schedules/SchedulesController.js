import SchedulesUseCase from "./SchedulesUseCase.js";

class SchedulesController {
  async createSchedules(req, res) {
    try {
      const schedulesData = req.body;
      const idUser = req.user.id;
      console.log(idUser);
      const newSchedules = await SchedulesUseCase.execute(schedulesData, idUser);
      res.status(201).json(newSchedules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new SchedulesController();
