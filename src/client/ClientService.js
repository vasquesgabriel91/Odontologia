import UserRepository from "../user/UserRepository.js";
import validatePassword from "../helpers/passwordValidator.js";
import validateFields from "../helpers/validateField.js";
import bcrypt from "bcryptjs";

class ClientService {
  async validateUserNameUnique(username) {
    const existingUser = await UserRepository.findByUserName(username);
    if (existingUser) throw new Error("Nome de usuário já está em uso");
  }
  async validateEmailUnique(email) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error("Este email já está em uso");
  }
  async validateTelephoneUnique(telephone) {
    const existingUser = await UserRepository.findByTelephone(telephone);
    if (existingUser) throw new Error("Número de celular já está em uso");
  }

  async isPasswordStrong(password) {
    validatePassword(password);
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async createClient(userData) {
    const { username, password, email, telephone } = userData;
    const role = "Client";
    await this.validateUserNameUnique(username);
    await this.isPasswordStrong(password);
    await this.validateEmailUnique(email);
    await this.validateTelephoneUnique(telephone);
    
    validateFields.validateEmail(email);

    if (!validateFields.validateCellphone(telephone)) {
      throw new Error("Telefone inválido");
    }

    const hashedPassword = await this.hashPassword(password);
    const newUserData = {
      ...userData,
      role,
      password: hashedPassword,
    };
    const execute = await UserRepository.create(newUserData);

    const output = {
      message: "Paciente criado com sucesso",
      id: execute.id,
      username: execute.username,
      email: execute.email,
      telephone: execute.telephone,
    };

    return output;
  }
}

export default new ClientService();
