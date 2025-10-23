import "dotenv/config";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import cors from "@fastify/cors";
import { routes } from "./routes/routes";

export const app = Fastify({
  logger: true,
  connectionTimeout: 60000 * 2,
  bodyLimit: 10485760, // 10MB
});

// CORS configurado corretamente
await app.register(cors, {
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// Multipart configurado
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
});

// Servir arquivos do front-end (pasta /public)
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/static/",
  maxAge: "1h",
  immutable: false,
  dotfiles: "deny",
});

// Servir arquivos de livros (pasta /document)
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "document"),
  prefix: "/document/",
  decorateReply: false, // ⚠️ evita conflito do sendFile
});

// Registra as rotas
app.register(routes);
