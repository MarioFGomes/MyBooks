// src/controllers/BookControllers.ts
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var documentDir = path.resolve("document");
if (!fs.existsSync(documentDir)) fs.mkdirSync(documentDir);
var BookController = class {
  static async upload(req, reply) {
    try {
      let title = "";
      let author = "";
      let description = "";
      let filename = "";
      for await (const part of req.parts()) {
        if (part.file) {
          filename = part.filename;
          const filePath = path.join(documentDir, filename);
          await fs.promises.writeFile(filePath, await part.toBuffer());
          console.log("\u{1F4C4} Arquivo salvo:", filePath);
        } else {
          if (part.fieldname === "title") title = part.value;
          if (part.fieldname === "author") author = part.value;
          if (part.fieldname === "description") description = part.value;
        }
      }
      const book = await prisma.book.create({
        data: {
          title,
          author,
          description,
          pdfPath: filename
        }
      });
      console.log("\u2705 Livro salvo na BD:", book);
      reply.send({ success: true, book });
    } catch (err) {
      console.error("\u274C Erro ao salvar livro:", err);
      if (err instanceof Error) {
        reply.status(500).send({ error: err.message });
      } else {
        reply.status(500).send({ error: String(err) });
      }
    }
  }
};

export {
  BookController
};
