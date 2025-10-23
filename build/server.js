import {
  app
} from "./chunk-WOZWKZKB.js";
import "./chunk-HC3RTSP5.js";
import "./chunk-TF7FKJCH.js";
import "./chunk-UGNWXG72.js";

// src/server.ts
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
