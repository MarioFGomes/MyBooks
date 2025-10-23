import {
  AuthController
} from "./chunk-TF7FKJCH.js";
import {
  BookController
} from "./chunk-UGNWXG72.js";

// src/routes/routes.ts
async function routes(fastify) {
  fastify.post("/login", AuthController.login);
  fastify.post("/upload", BookController.upload);
  fastify.get("/books", BookController.list);
  fastify.put("/books/:id", BookController.update);
  fastify.delete("/books/:id", BookController.delete);
}

export {
  routes
};
