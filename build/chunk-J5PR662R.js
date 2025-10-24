import {
  AuthController
} from "./chunk-CYIATD7L.js";
import {
  BookController
} from "./chunk-UGNWXG72.js";

// src/routes/routes.ts
async function routes(fastify) {
  fastify.post("/login", AuthController.login);
  fastify.post("/upload", { preHandler: AuthController.verificarAdmin }, BookController.upload);
  fastify.get("/books", BookController.list);
  fastify.put("/books/:id", { preHandler: AuthController.verificarAdmin }, BookController.update);
  fastify.delete("/books/:id", { preHandler: AuthController.verificarAdmin }, BookController.delete);
}

export {
  routes
};
