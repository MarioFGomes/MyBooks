import {
  routes
} from "./chunk-J5PR662R.js";

// src/app.ts
import "dotenv/config";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import cors from "@fastify/cors";
var app = Fastify({
  logger: true,
  connectionTimeout: 6e4 * 2,
  bodyLimit: 10485760
  // 10MB
});
await app.register(cors, {
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
});
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    // 10MB
    files: 5
  }
});
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/static/",
  maxAge: "1h",
  immutable: false,
  dotfiles: "deny"
});
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "document"),
  prefix: "/document/",
  decorateReply: false
  // ⚠️ evita conflito do sendFile
});
app.register(routes);

export {
  app
};
