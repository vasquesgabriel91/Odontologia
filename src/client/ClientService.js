import UserRepository from "../user/UserRepository.js";
import validatePassword from "../helpers/passwordValidator.js";
import bcrypt from "bcryptjs";

class ClientService {
  async validateUserNameUnique(username) {
    const existingUser = await UserRepository.findByUserName(username);
    if (existingUser) throw new Error("Nome de usuário já está em uso");
  }

  async isPasswordStrong(password) {
    validatePassword(password);
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async createClient(userData) {
    const { username, password } = userData;
    const role = "Client";
    await this.validateUserNameUnique(username);
    await this.isPasswordStrong(password);

    const hashedPassword = await this.hashPassword(password);
    const newUserData = { ...userData, role, password: hashedPassword };
    const execute = await UserRepository.create(newUserData);

    const output = {
      message: "Doutor criado com sucesso",
      id: execute.id,
      username: execute.username,
      role: execute.role,
      
    };

    return output;
  }
}

export default new ClientService();
