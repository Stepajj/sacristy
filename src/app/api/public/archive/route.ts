import { NextResponse } from 'next/server';
import { getArchiveEvents } from '@/services';

export async function GET() {
  try {
    const data = await getArchiveEvents();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API][Public][Archive] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
