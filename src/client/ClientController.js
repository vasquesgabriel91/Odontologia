import e from "express";
import ClientUseCase from "./ClientUseCase.js";

class ClientController {
  async createClient(req, res) {
    const userData = req.body;
    try {
      const create = await ClientUseCase.execute(userData);
      res.status(201).json({
        message: create,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async myAppointmentPatient(req, res) {
    const clientId = req.user.id; 
    try {
      const appointments = await ClientUseCase.getMyAppointmentsClient(clientId);
      res.status(200).json(appointments);
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ClientController();
