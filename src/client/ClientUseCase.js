import ClientService from "./ClientService.js";

class ClientUseCase {
  async execute(userData) {
    try {
      const result = await ClientService.createClient(userData);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
}
export default new ClientUseCase();