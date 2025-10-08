function checkRoles(allowedRoles = []) {
  return async function (req, res, next) {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Acesso negado: você não possui permissão o sulficiente." });
      }

      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Acesso negado: você não tem permissão o insuficiente." });
      }

      next(); 
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro:", error: error.message });
    }
  };
}

export default checkRoles;
