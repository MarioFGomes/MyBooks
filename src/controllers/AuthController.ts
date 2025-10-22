import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
  static async login(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = req.body as { email: string; password: string };

    if (email === "dp4144@gmail.com" && password === "123") {
      return { message: "Login bem-sucedido!" };
    } else {
      return reply.status(401).send({ message: "Email ou senha incorretos." });
    }
  }
}
