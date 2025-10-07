import e from "express";
import AdminUseCase from "./AdminUseCase.js";

class AdminController {
  async createAdmin(req, res) {
    const userData = req.body;
    try {
      const create = await AdminUseCase.execute(userData);
      res.status(201).json({
        messagem: create,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AdminController();
