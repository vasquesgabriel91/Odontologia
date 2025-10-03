import SecretaryUseCase from "./SecretaryUseCase.js";

class SecretaryController {
  async createSecretary(req, res) {
    const userData = req.body;
    try {
      const newSecretary = await SecretaryUseCase.execute(userData);
      res.status(201).json(newSecretary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new SecretaryController();
