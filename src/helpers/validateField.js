const validateFields = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }
    return true;
  },

  validateCellphone: (telephone) => {
    telephone = telephone.replace(/\D/g, "");

    if (telephone.length < 10 || telephone.length > 11) return false;

    if (telephone.length === 11 && parseInt(telephone.substring(2, 3)) !== 9)
      return false;

    const temp = telephone.substring(2);

    if (/^(\d)\1+$/.test(temp)) return false;

    if (/0123456789/.test(temp) || /9876543210/.test(temp)) return false;

    if (/(\d)\1{4,}/.test(temp)) return false;

    return true;
  },
};

export default validateFields;
