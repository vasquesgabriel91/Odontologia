import AuthService from "./AuthService.js";

class AuthUseCase {
     async execute(username, password) {
        try {
            const result = await AuthService.login(username, password);
            return result;
        } catch (error) {
            throw new Error("Erro na autenticação: " + error.message);
        }
     }
}

export default new AuthUseCase();