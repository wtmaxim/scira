import { prisma } from './client';
import { SearchGroupId } from '@/lib/utils';

// Interface pour les données de recherche
interface SearchData {
  query: string;
  groupId: SearchGroupId;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

// Interface pour les données de réponse
interface ResponseData {
  content: string;
  searchId: string;
  toolsUsed: string[];
  metadata?: any;
}

// Service pour gérer les recherches
export const searchService = {
  // Créer une nouvelle recherche
  async createSearch(data: SearchData) {
    return await prisma.search.create({
      data: {
        query: data.query,
        groupId: data.groupId,
        userId: data.userId,
        ip: data.ip,
        userAgent: data.userAgent
      }
    });
  },

  // Récupérer une recherche par ID
  async getSearchById(id: string) {
    return await prisma.search.findUnique({
      where: { id },
      include: { responses: true }
    });
  },

  // Récupérer toutes les recherches d'un utilisateur
  async getSearchesByUserId(userId: string) {
    return await prisma.search.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { responses: true }
    });
  },

  // Récupérer les recherches récentes
  async getRecentSearches(limit = 10) {
    return await prisma.search.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { responses: true }
    });
  }
};

// Service pour gérer les réponses
export const responseService = {
  // Créer une nouvelle réponse
  async createResponse(data: ResponseData) {
    return await prisma.response.create({
      data: {
        content: data.content,
        searchId: data.searchId,
        toolsUsed: data.toolsUsed,
        metadata: data.metadata
      }
    });
  },

  // Récupérer une réponse par ID
  async getResponseById(id: string) {
    return await prisma.response.findUnique({
      where: { id },
      include: { search: true }
    });
  },

  // Récupérer toutes les réponses d'une recherche
  async getResponsesBySearchId(searchId: string) {
    return await prisma.response.findMany({
      where: { searchId },
      orderBy: { createdAt: 'desc' }
    });
  }
}; 