// src/controllers/BookControllers.ts
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var documentDir = path.resolve("document");
if (!fs.existsSync(documentDir)) fs.mkdirSync(documentDir);
var BookController = class {
  // 📤 Upload de livro
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
        data: { title, author, description, pdfPath: filename }
      });
      console.log("\u2705 Livro salvo na BD:", book);
      reply.send({ success: true, book });
    } catch (err) {
      console.error("\u274C Erro ao salvar livro:", err);
      reply.status(500).send({ error: err instanceof Error ? err.message : String(err) });
    }
  }
  // 📚 Listar todos os livros
  static async list(req, reply) {
    try {
      const books = await prisma.book.findMany({ orderBy: { id: "desc" } });
      reply.send(books);
    } catch (err) {
      console.error("\u274C Erro ao listar livros:", err);
      reply.status(500).send({ error: "Falha ao listar livros" });
    }
  }
  // ✏️ Atualizar livro
  static async update(req, reply) {
    try {
      const { id } = req.params;
      const { title, author, description } = req.body;
      const bookExists = await prisma.book.findUnique({ where: { id: Number(id) } });
      if (!bookExists) {
        reply.status(404).send({ error: "Livro n\xE3o encontrado" });
        return;
      }
      const updated = await prisma.book.update({
        where: { id: Number(id) },
        data: { title, author, description }
      });
      console.log("\u{1F4DD} Livro atualizado:", updated);
      reply.send({ success: true, updated });
    } catch (err) {
      console.error("\u274C Erro ao atualizar livro:", err);
      reply.status(500).send({ error: "Falha ao atualizar livro" });
    }
  }
  // 🗑️ Excluir livro
  static async delete(req, reply) {
    try {
      const { id } = req.params;
      const book = await prisma.book.findUnique({ where: { id: Number(id) } });
      if (!book) {
        reply.status(404).send({ error: "Livro n\xE3o encontrado" });
        return;
      }
      const filePath = path.join(documentDir, book.pdfPath);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log("\u{1F5D1}\uFE0F PDF removido:", filePath);
      }
      await prisma.book.delete({ where: { id: Number(id) } });
      reply.send({ success: true, message: "Livro exclu\xEDdo com sucesso!" });
    } catch (err) {
      console.error("\u274C Erro ao excluir livro:", err);
      reply.status(500).send({ error: "Falha ao excluir livro" });
    }
  }
};

export {
  BookController
};
