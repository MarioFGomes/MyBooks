import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const documentDir = path.resolve("document");
if (!fs.existsSync(documentDir)) fs.mkdirSync(documentDir);

export class BookController {
  static async upload(req: FastifyRequest, reply: FastifyReply) {
    try {
      let title = "";
      let author = "";
      let description = "";
      let filename = "";

      // Percorre o formulário multipart
      for await (const part of (req as any).parts()) {
        if (part.file) {
          filename = part.filename;
          const filePath = path.join(documentDir, filename);
          await fs.promises.writeFile(filePath, await part.toBuffer());
          console.log("📄 Arquivo salvo:", filePath);
        } else {
          if (part.fieldname === "title") title = part.value;
          if (part.fieldname === "author") author = part.value;
          if (part.fieldname === "description") description = part.value;
        }
      }

      // 🔹 Insere no banco com os nomes corretos do schema
      const book = await prisma.book.create({
        data: {
          title,
          author,
          description,
          pdfPath: filename,
        },
      });

      console.log("✅ Livro salvo na BD:", book);
      reply.send({ success: true, book });
    } catch (err) {
      console.error("❌ Erro ao salvar livro:", err);
      if (err instanceof Error) {
        reply.status(500).send({ error: err.message });
      } else {
        reply.status(500).send({ error: String(err) });
      }
    }
  }
}
