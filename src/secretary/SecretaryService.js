class SecretaryService {
  async createSecretary(userData) {
    const log = console.log("Criando usuário:");
    return {log}; // simulando retorno
  }
}

export default new SecretaryService();
