import { searchService } from '@/lib/prisma/services';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const userId = searchParams.get('userId');

  try {
    let searches;

    if (userId) {
      // Récupérer les recherches d'un utilisateur spécifique
      searches = await searchService.getSearchesByUserId(userId);
    } else {
      // Récupérer les recherches récentes
      searches = await searchService.getRecentSearches(limit);
    }

    return NextResponse.json({ searches });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    );
  }
} 