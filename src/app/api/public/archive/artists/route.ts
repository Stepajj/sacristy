import { NextResponse } from 'next/server';
import { getArtistArchive } from '@/services';

export async function GET() {
  try {
    const data = await getArtistArchive();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API][Public][Archive][Artists] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
