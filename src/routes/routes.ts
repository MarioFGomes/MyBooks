import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";
import { BookController } from "../controllers/BookControllers";

export async function routes(fastify: FastifyInstance) {
  fastify.post("/login", AuthController.login);
  fastify.post("/upload", {preHandler: AuthController.verificarAdmin }, BookController.upload);
  fastify.get("/books", BookController.list);
  fastify.put("/books/:id", {preHandler: AuthController.verificarAdmin }, BookController.update);
  fastify.delete("/books/:id", {preHandler: AuthController.verificarAdmin }, BookController.delete);
}
