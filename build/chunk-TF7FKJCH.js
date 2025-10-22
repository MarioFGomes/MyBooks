// src/controllers/AuthController.ts
var AuthController = class {
  static async login(req, reply) {
    const { email, password } = req.body;
    if (email === "dp4144@gmail.com" && password === "123") {
      return { message: "Login bem-sucedido!" };
    } else {
      return reply.status(401).send({ message: "Email ou senha incorretos." });
    }
  }
};

export {
  AuthController
};
