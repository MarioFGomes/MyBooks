import "dotenv/config";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import cors from "@fastify/cors"; // ✅ Plugin correto
import { routes } from "./routes/index.js";

const app = Fastify({
  logger: true,
  connectionTimeout: 60000 * 2,
  bodyLimit: 10485760, // 10MB
});

// ✅ CORS configurado corretamente
await app.register(cors, {
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// ✅ Multipart configurado
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
});

// ✅ Servir arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "public"),
  prefix: "/static/",
  maxAge: "1h",
  immutable: false,
  dotfiles: "deny",
});

// ✅ Registra as rotas
app.register(routes);

// ✅ Inicializa o servidor
const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Servidor rodando em http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
