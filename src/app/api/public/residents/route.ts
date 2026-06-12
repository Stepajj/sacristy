import { NextResponse } from 'next/server';
import { getResidents } from '@/services';

export async function GET() {
  try {
    const data = await getResidents();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API][Public][Residents] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
