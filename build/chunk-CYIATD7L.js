// src/controllers/AuthController.ts
import jwt from "jsonwebtoken";
var SECRET_KEY = process.env.JWT_SECRET || "chave-super-secreta";
var AuthController = class {
  // 🔹 Login do administrador
  static async login(req, reply) {
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "dp4144@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123";
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin", email }, SECRET_KEY, { expiresIn: "1h" });
      return reply.send({
        success: true,
        message: "\u2705 Login bem-sucedido!",
        token
      });
    }
    return reply.status(401).send({ success: false, message: "Email ou senha incorretos." });
  }
  // 🔹 Middleware para proteger rotas de administrador
  static async verificarAdmin(req, reply) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ error: "Token n\xE3o fornecido." });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      if (decoded.role !== "admin") {
        return reply.status(403).send({ error: "Acesso negado. Apenas administradores." });
      }
      req.user = decoded;
    } catch (err) {
      console.error("\u274C Erro na verifica\xE7\xE3o do token:", err);
      return reply.status(401).send({ error: "Token inv\xE1lido ou expirado." });
    }
  }
};

export {
  AuthController
};
