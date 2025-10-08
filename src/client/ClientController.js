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
}

export default new ClientController();
