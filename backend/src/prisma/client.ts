import { PrismaClient } from "@prisma/client";

// Centralise Prisma client pour éviter les instanciations multiples
const prisma = new PrismaClient();

export default prisma;
