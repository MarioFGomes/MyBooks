// src/controllers/BookControllers.ts
import fs from "fs";
import path from "path";
var documentDir = path.resolve("document");
if (!fs.existsSync(documentDir)) fs.mkdirSync(documentDir);
var BookController = class {
  static async upload(req, reply) {
    try {
      let title = "";
      let author = "";
      let category = "";
      let description = "";
      let filename = "";
      for await (const part of req.parts()) {
        if (part.file) {
          filename = part.filename;
          const filePath = path.join(documentDir, filename);
          await fs.promises.writeFile(filePath, await part.toBuffer());
          console.log("\u{1F4C4} Arquivo salvo com sucesso:", filePath);
        } else {
          if (part.fieldname === "title") title = part.value;
          if (part.fieldname === "author") author = part.value;
          if (part.fieldname === "category") category = part.value;
          if (part.fieldname === "description") description = part.value;
        }
      }
      reply.send({ success: true, filename, title, author, category, description });
    } catch (err) {
      console.error("\u274C Erro no upload:", err);
      reply.status(500).send({ error: "Falha no upload" });
    }
  }
};

export {
  BookController
};
