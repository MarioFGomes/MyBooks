import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const Books = prisma.book;


export interface Book {
  title: string;
  author: string;
  category: string;
  description: string;
  filename: string;
}
