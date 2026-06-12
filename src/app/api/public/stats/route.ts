import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/services';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { page, referrer, userAgent } = await request.json();
    
    // Get IP for hashing
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
               
    // Simple hash for IP to preserve privacy (like in legacy)
    const ipHash = crypto
      .createHash('sha256')
      .update(ip + 'sacristy-next-salt')
      .digest('hex')
      .substring(0, 8);

    await trackPageView({
      page: page || '/',
      referrer,
      userAgent,
      ipHash,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Analytics failure should not crash the request flow for the client
    console.error('[API][Public][Stats] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record stats' }, { status: 500 });
  }
}
