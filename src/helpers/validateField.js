const validateFields = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }
    return true;
  },

  validateCellphone: (telephone) => {
    console.log("[validateCellphone] Telefone original:", telephone);

    if (!telephone) {
      console.log("[validateCellphone] Telefone indefinido ou nulo");
      return false;
    }

    telephone = telephone.replace(/\D/g, "");
    console.log("[validateCellphone] Só números:", telephone);

    if (telephone.length < 10 || telephone.length > 11) {
      console.log("[validateCellphone] Tamanho inválido:", telephone.length);
      return false;
    }

    if (telephone.length === 11 && parseInt(telephone.substring(2, 3)) !== 9) {
      console.log("[validateCellphone] Dígito 9 ausente");
      return false;
    }

    const temp = telephone.substring(2);
    console.log("[validateCellphone] Número sem DDD:", temp);

    if (/^(\d)\1+$/.test(temp)) {
      console.log("[validateCellphone] Dígitos repetidos");
      return false;
    }

    if (/0123456789/.test(temp) || /9876543210/.test(temp)) {
      console.log("[validateCellphone] Sequência inválida");
      return false;
    }

    if (/(\d)\1{4,}/.test(temp)) {
      console.log("[validateCellphone] Repetição de dígito");
      return false;
    }

    console.log("[validateCellphone] Número válido");
    return true;
  },
  
  validateZipCode: (cep) => {
    return /^\d{8}$/.test(cep.replace(/[^\d]+/g, ""));
  },
};

export default validateFields;
