import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import SecretaryRepository from "../secretary/SecretaryRepository.js";
import config from "../config/app.js";

class AuthService {
  constructor() {
    this.secret = config.jwt.secret;
    this.expiresIn = config.jwt.expiresIn;
  }
  generateToken(user) {
    const payload = { id: user.id, username: user.username };
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
    const user = await SecretaryRepository.findByUserName(username);
    if (!user) throw new Error("Usuário não encontrado");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Senha inválida");

    const token = this.generateToken({ id: user.id, username: user.username });

    return { token, user: { id: user.id, username: user.username } };
  }
}

export default new AuthService();