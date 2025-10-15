import AppointmentsUseCase from "./AppointmentsUseCase.js";

class AppointmentsController{
     async listSchedules (req, res){
    try {
      const getSchedules = await AppointmentsUseCase.getAllSchedules();
       res.status(200).json(getSchedules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
export default new AppointmentsController;