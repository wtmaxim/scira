import { searchService } from '@/lib/prisma/services';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Extraire l'ID directement depuis le segment de l'URL de la requête
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const search = await searchService.getSearchById(id);

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ search });
  } catch (error) {
    console.error('Error fetching search details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search details' },
      { status: 500 }
    );
  }
} 