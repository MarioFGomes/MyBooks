import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "chave-super-secreta"; // 🔐 chave usada no JWT

export class AuthController {
  // 🔹 Login do administrador
  static async login(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = req.body as { email: string; password: string };

    // ✅ Verifica se é o administrador autorizado
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "dp4144@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // 🔸 Gera token JWT com validade de 1h
      const token = jwt.sign({ role: "admin", email }, SECRET_KEY, { expiresIn: "1h" });

      return reply.send({
        success: true,
        message: "✅ Login bem-sucedido!",
        token,
      });
    }

    // ❌ Caso email/senha errados
    return reply.status(401).send({ success: false, message: "Email ou senha incorretos." });
  }

  // 🔹 Middleware para proteger rotas de administrador
  static async verificarAdmin(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ error: "Token não fornecido." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY) as { role: string };

      if (decoded.role !== "admin") {
        return reply.status(403).send({ error: "Acesso negado. Apenas administradores." });
      }

      // ✅ Autorizado — deixa prosseguir
      (req as any).user = decoded;
    } catch (err) {
      console.error("❌ Erro na verificação do token:", err);
      return reply.status(401).send({ error: "Token inválido ou expirado." });
    }
  }
}
