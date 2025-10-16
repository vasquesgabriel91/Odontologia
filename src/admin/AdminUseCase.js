import AdminService from "./AdminService.js";

class AdminUseCase {
  async execute(userData) {
    try {
      const result = await AdminService.createAdmin(userData);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
  async delete(idParam, idUser) {
    try {
      if (idParam == idUser) {
        throw new Error("Você não pode deletar a si mesmo");
      }
      const result = await AdminService.deleteDoctor(idParam);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }

  async listAllUsers() {
    try {
      const users = await AdminService.listUsers();
      return users;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
  async update(idParam, loggedUserId, userData) {
    try {
      if (idParam == loggedUserId) {
        throw new Error("Você não pode alterar seu próprio usuário.");
      }

      if (userData.role) {
        delete userData.role;
      }
      const result = await AdminService.updateUser(idParam, userData);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export default new AdminUseCase();
