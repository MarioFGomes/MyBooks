import {
  AuthController
} from "./chunk-TF7FKJCH.js";
import {
  BookController
} from "./chunk-JO4MOOKF.js";

// src/routes/index.ts
async function routes(fastify) {
  fastify.post("/login", AuthController.login);
  fastify.post("/upload", BookController.upload);
}

export {
  routes
};
