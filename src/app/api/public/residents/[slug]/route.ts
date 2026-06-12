import { NextRequest, NextResponse } from 'next/server';
import { getResidentBySlug } from '@/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await getResidentBySlug(slug);
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Resident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const { slug } = await params;
    console.error(`[API][Public][Resident][${slug}] Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
