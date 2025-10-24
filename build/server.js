import {
  app
} from "./chunk-VYX52BCA.js";
import "./chunk-J5PR662R.js";
import "./chunk-CYIATD7L.js";
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
