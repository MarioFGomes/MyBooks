import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";
import { BookController } from "../controllers/BookControllers";

export async function routes(fastify: FastifyInstance) {
  fastify.post("/login", AuthController.login);
  fastify.post("/upload", BookController.upload);
}
