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
  async deleteUser(req, res) {
    const idParam = req.params.id;
    const idUser = req.user.id;
    try {
      const deleteUser = await AdminUseCase.delete(idParam, idUser);
      res.status(200).json({ message: deleteUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listUsers(req, res) {
    try {
      const users = await AdminUseCase.listAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AdminController();
