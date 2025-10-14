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
}
export default new AdminUseCase();
