import {
  routes
} from "./chunk-TTZUOB5G.js";
import "./chunk-TF7FKJCH.js";
import "./chunk-JO4MOOKF.js";

// src/server.ts
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
app.register(routes);
var start = async () => {
  try {
    await app.listen({ port: 3e3, host: "0.0.0.0" });
    console.log("\u{1F680} Servidor rodando em http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
