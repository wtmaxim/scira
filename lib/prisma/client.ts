import { PrismaClient } from '../../lib/generated/prisma';

// Déclaration pour éviter les erreurs de TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

// Utilisation d'un singleton pour éviter de multiples instances en développement
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
} 