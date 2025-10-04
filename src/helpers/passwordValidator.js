function validatePassword(password) {
    if (!/[A-Z]/.test(password)) throw new Error("Deve ter ao menos 1 letra maiúscula");  
    if(!/[0-9]/.test(password)) throw new Error("Deve ter ao menos 1 Número");
    if(!/[!@#\$%\^&\*]/.test(password)) throw new Error("Deve ter ao menos 1 caractere especial");
    if (password.length < 8) throw new Error("Deve ter no mínimo 8 caracteres");
    return true;
}   

export default validatePassword;