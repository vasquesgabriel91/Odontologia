import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserRepository from "../user/UserRepository.js";
import config from "../config/app.js";
import sendEmail from "../helpers/emailSender.js"; // Importe o helper
import validatePassword from "../helpers/passwordValidator.js"; // Importe o validador

class AuthService {
  constructor() {
    this.secret = config.jwt.secret;
    this.expiresIn = config.jwt.expiresIn;
  }

  generateToken(user) {
    const payload = { id: user.id, role: user.role, username: user.username };
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error("Token inválido: " + error.message);
    }
  }

  async login(username, password) {
    const user = await UserRepository.findByUserNameOrEmail(username);
    if (!user) throw new Error("Usuário não encontrado");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Senha inválida");

    const token = this.generateToken({ id: user.id, role: user.role, username: user.username });

    return { token, user: { id: user.id, role: user.role, username: user.username } };
  }

  // --- NOVOS MÉTODOS ---

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado com este e-mail.");

    // Gera um token específico para reset, válido por 15 minutos
    const resetToken = jwt.sign({ id: user.id, type: "reset" }, this.secret, { expiresIn: "15m" });
    
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    const html = `
      <h3>Recuperação de Senha - Záyon Odontologia</h3>
      <p>Olá ${user.username},</p>
      <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetLink}" target="_blank">Redefinir Minha Senha</a>
      <p>Este link expira em 15 minutos.</p>
      <p>Se você não solicitou isso, ignore este e-mail.</p>
    `;

    await sendEmail(email, "Recuperação de Senha", html);
    return { message: "Email de recuperação enviado com sucesso." };
  }

  async resetPassword(token, newPassword) {
    let decoded;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (e) {
      throw new Error("Link de recuperação inválido ou expirado.");
    }

    if (decoded.type !== "reset") throw new Error("Token inválido para esta operação.");

    // Valida a força da nova senha
    validatePassword(newPassword);

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualiza no banco (Reutilizando o método update do UserRepository)
    await UserRepository.update(decoded.id, { password: hashedPassword });

    return { message: "Senha alterada com sucesso." };
  }
}

export default new AuthService();