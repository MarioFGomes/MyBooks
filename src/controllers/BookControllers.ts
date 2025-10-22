import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import path from "path";
import { Book } from "../models/Book.js";

const documentDir = path.resolve("document");
if (!fs.existsSync(documentDir)) fs.mkdirSync(documentDir);

export class BookController {
  static async upload(req: FastifyRequest, reply: FastifyReply) {
    try {
      let title = "";
      let author = "";
      let category = "";
      let description = "";
      let filename = "";

      // Percorre todas as partes do multipart (arquivos e campos)
      for await (const part of (req as any).parts()) {
        if (part.file) {
          // Parte do arquivo
          filename = part.filename;
          const filePath = path.join(documentDir, filename);
          await fs.promises.writeFile(filePath, await part.toBuffer());
          console.log("📄 Arquivo salvo com sucesso:", filePath);
        } else {
          // Campos do formulário
          if (part.fieldname === "title") title = part.value;
          if (part.fieldname === "author") author = part.value;
          if (part.fieldname === "category") category = part.value;
          if (part.fieldname === "description") description = part.value;
        }
      }

      // (Opcional) Salvar no banco de dados
      // await Book.create({ title, author, category, description, file: filename });

      reply.send({ success: true, filename, title, author, category, description });
    } catch (err) {
      console.error("❌ Erro no upload:", err);
      reply.status(500).send({ error: "Falha no upload" });
    }
  }
}
