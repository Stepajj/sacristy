import { NextRequest, NextResponse } from 'next/server';
import { createResident, updateResident, deleteResident } from '@/services/resident.service';
import { ResidentSchema } from '@/lib/validation/resident.schema';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const validation = ResidentSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validation.error.flatten() 
      }, { status: 400 });
    }

    const resident = await createResident(validation.data);
    revalidateTag(CACHE_TAGS.residents, { expire: 0 });

    return NextResponse.json({ success: true, data: resident });
  } catch (error: unknown) {
    console.error('[API][Admin][Residents] Create error:', error);
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

    const validation = ResidentSchema.partial().safeParse(updateData);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validation.error.flatten() 
      }, { status: 400 });
    }

    const resident = await updateResident(id, validation.data);
    revalidateTag(CACHE_TAGS.residents, { expire: 0 });

    return NextResponse.json({ success: true, data: resident });
  } catch (error: unknown) {
    console.error('[API][Admin][Residents] Update error:', error);
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

    await deleteResident(parseInt(id));
    revalidateTag(CACHE_TAGS.residents, { expire: 0 });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[API][Admin][Residents] Delete error:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
