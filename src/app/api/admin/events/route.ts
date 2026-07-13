import { NextRequest, NextResponse } from 'next/server';
import { createEvent, updateEvent, deleteEvent } from '@/services/event.service';
import { EventSchema } from '@/lib/validation/event.schema';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const validation = EventSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validation.error.flatten() 
      }, { status: 400 });
    }

    const event = await createEvent({
      ...validation.data,
      eventDate: new Date(validation.data.eventDate),
    });
    revalidateTag(CACHE_TAGS.events, { expire: 0 });

    return NextResponse.json({ success: true, data: event });
  } catch (error: unknown) {
    console.error('[API][Admin][Events] Create error:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
    }

    const validation = EventSchema.partial().safeParse(updateData);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validation.error.flatten() 
      }, { status: 400 });
    }

    const event = await updateEvent(id, {
      ...validation.data,
      eventDate: validation.data.eventDate ? new Date(validation.data.eventDate) : undefined,
    });
    revalidateTag(CACHE_TAGS.events, { expire: 0 });

    return NextResponse.json({ success: true, data: event });
  } catch (error: unknown) {
    console.error('[API][Admin][Events] Update error:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
    }

    await deleteEvent(parseInt(id));
    revalidateTag(CACHE_TAGS.events, { expire: 0 });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[API][Admin][Events] Delete error:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
