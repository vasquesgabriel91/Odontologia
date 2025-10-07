import AuthService from "../auth/AuthService.js";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

export default authMiddleware;
