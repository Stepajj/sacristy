import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await getEventBySlug(slug);
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const { slug } = await params;
    console.error(`[API][Public][Event][${slug}] Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
