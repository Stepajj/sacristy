import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '@/lib/storage/image';
import { saveFile } from '@/lib/storage/upload';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process image (resize, convert to webp)
    const processedBuffer = await processImage(buffer);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const filename = `${timestamp}_${randomString}.webp`;

    const fileUrl = await saveFile(processedBuffer, filename);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('[API][Admin][Upload] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
