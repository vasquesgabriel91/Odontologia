import SecretaryRepository from "./SecretaryRepository.js";
import validatePassword from "../helpers/passwordValidator.js";
import bcrypt from "bcryptjs";

class SecretaryService {
  async validateUserNameUnique(username) {
    const existingUser = await SecretaryRepository.findByUserName(username);
    if (existingUser) throw new Error("Nome de usuário já está em uso");
  }

  async isPasswordStrong(password) {
    validatePassword(password);
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async createSecretary(userData) {
    const { username, password } = userData;

    await this.validateUserNameUnique(username);
    await this.isPasswordStrong(password);

    const hashedPassword = await this.hashPassword(password);
    const newUserData = { ...userData, password: hashedPassword };
    const execute = await SecretaryRepository.create(newUserData);

    const output = {
      message: "Secretária criada com sucesso",
      username: execute.username,
    };

    return output;
  }
}

export default new SecretaryService();
