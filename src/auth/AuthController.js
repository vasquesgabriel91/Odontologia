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

  // --- NOVOS MÉTODOS ---

  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const result = await AuthUseCase.executeForgotPassword(email);
      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Erro ao solicitar reset de senha: ${error.message}`);
      // Por segurança, as vezes é bom retornar 200 mesmo se o email não existir, 
      // mas aqui retornaremos 400 para facilitar seu desenvolvimento.
      return res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      const result = await AuthUseCase.executeResetPassword(token, newPassword);
      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Erro ao resetar senha: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }
  }
}
export default new AuthController();