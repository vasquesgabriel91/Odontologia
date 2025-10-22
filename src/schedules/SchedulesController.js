import SchedulesUseCase from "./SchedulesUseCase.js";

class SchedulesController {
  async createSchedules(req, res) {
    try {
      const schedulesData = req.body;
      const idUser = req.user.id;
      const newSchedules = await SchedulesUseCase.execute(
        schedulesData,
        idUser
      );
      res.status(201).json(newSchedules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getMySchedules(req, res) {
    try {
      const idUser = req.user.id;
      const users = await SchedulesUseCase.getMySchedules(idUser);
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getMyAppointments(req, res) {
    try {
      const id = req.user.id;
      const appointments = await SchedulesUseCase.getMyAppointments(id);
      res.status(200).json(appointments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    } 
  }
}

export default new SchedulesController();
