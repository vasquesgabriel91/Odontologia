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
}
export default new AdminUseCase();