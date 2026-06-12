import { NextRequest, NextResponse } from 'next/server';
import { updateSetting } from '@/services/settings.service';
import { logAction } from '@/services/activity-log.service';

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    
    for (const [key, value] of Object.entries(data)) {
      await updateSetting(key, value as string);
    }

    await logAction('UPDATE_SETTINGS', 'Updated site settings');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API][Admin][Settings] Update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
