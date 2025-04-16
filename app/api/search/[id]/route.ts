import { searchService } from '@/lib/prisma/services';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const searchId = params.id;
    const search = await searchService.getSearchById(searchId);

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