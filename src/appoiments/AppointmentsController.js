import AppointmentsUseCase from "./AppointmentsUseCase.js";

class AppointmentsController {
  async listSchedules(req, res) {
    try {
      const getSchedules = await AppointmentsUseCase.getAllSchedules();
      res.status(200).json(getSchedules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async createAppointments(req, res) {
    try {
      const scheduleId = req.params.id;
      const secretaryId = req.user.id;
      const  { email, startTime, endTime, status, descricao } = req.body;

      const createAppointments = await AppointmentsUseCase.createAppointments(
        scheduleId,
        secretaryId,
        { email, startTime, endTime, status, descricao }
      );
      res.status(200).json(createAppointments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
export default new AppointmentsController();
