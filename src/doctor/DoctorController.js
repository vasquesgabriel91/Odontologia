import e from "express";
import DoctorUseCase from "./DoctorUseCase.js";

class DoctorController {
  async createDoctor(req, res) {
    const userData = req.body;
    try {
      const create = await DoctorUseCase.execute(userData);
      res.status(201).json({
        message: create,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
 
}

export default new DoctorController();
