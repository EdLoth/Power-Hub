import { config } from "dotenv"
import { PrismaClient } from "@prisma/client"

// Carrega as variáveis de ambiente do arquivo .env
config()

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
})
