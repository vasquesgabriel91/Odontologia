import UserRepository from "../user/UserRepository.js";
import validatePassword from "../helpers/passwordValidator.js";
import bcrypt from "bcryptjs";
const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class AdminService {
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

  async createAdmin(userData) {
    const { username, password } = userData;
    const role = "admin";
    await this.validateUserNameUnique(username);
    await this.isPasswordStrong(password);

    const hashedPassword = await this.hashPassword(password);
    const newUserData = { ...userData, role, password: hashedPassword };
    const execute = await UserRepository.create(newUserData);

    const output = {
      message: "Administrador criado com sucesso",
      id: execute.id,
      username: execute.username,
      role: execute.role,
    };

    return output;
  }
  async deleteDoctor(idParam) {
    try {
      const deleteUser = await UserRepository.delete(idParam);
      return "Usúario deletado com sucesso";
    } catch (error) {
      throw new Error("Erro ao deletar o doutor: " + error.message);
    }
  }
  async listUsers() {
    try {
      const users = await UserRepository.findAll();

      const output = users.map((user) => ({
        ...user.dataValues,
        links: {
          update: `${baseUrl}${API_PREFIX}/user/update/${user.id}`,
          delete: `${baseUrl}${API_PREFIX}/user/destroy/${user.id}`,
        },
      }));

      return output;
    } catch (error) {
      throw new Error("Erro ao listar os usuários: " + error.message);
    }
  }
  async updateUser(idParam, userData) {
    try {
      const user = await UserRepository.findById(idParam);
      if (!user) throw new Error("Usuário não encontrado");

      const updatedUser = await UserRepository.update(idParam, userData);
      return updatedUser;
    } catch (error) {
      throw new Error("Erro ao atualizar o usuário: " + error.message);
    }
  }
}

export default new AdminService();
