import SecretaryService from "./SecretaryService.js";

class SecretaryUseCase {
  async execute(userData) {
    try {
      const result = await SecretaryService.createSecretary(userData);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
}

export default new SecretaryUseCase();
