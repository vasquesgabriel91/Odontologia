import logger from "../shared/logger.js";
import AuthUseCase from "./AuthUseCase.js";

class AuthController {
  async authenticate(req, res) {
    const { username, password } = req.body;
    try {
      const user = await AuthUseCase.execute(username, password);
      logger.info(`Usuário ${username} autenticado com sucesso".`);
      return res.status(200).json(user);
    } catch (error) {
      logger.error(`Erro ao autenticar usuário ${username}: ${error.message}`);
      return res.status(401).json({ message: error.message });
    }
  }
}
export default new AuthController();
