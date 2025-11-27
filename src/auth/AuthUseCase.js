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

     // --- NOVOS MÉTODOS ---
     async executeForgotPassword(email) {
        return await AuthService.forgotPassword(email);
     }

     async executeResetPassword(token, newPassword) {
        return await AuthService.resetPassword(token, newPassword);
     }
}

export default new AuthUseCase();