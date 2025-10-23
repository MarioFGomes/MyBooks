// src/models/Book.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var Books = prisma.book;
export {
  Books
};
