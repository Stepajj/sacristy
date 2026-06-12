import { NextResponse } from 'next/server';
import { getPublicSettings } from '@/services';

export async function GET() {
  try {
    const data = await getPublicSettings();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API][Public][Settings] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
