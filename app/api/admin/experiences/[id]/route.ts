import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@lib/admin-auth';
import { updateExperience, deleteExperience } from '@lib/profile-db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;
  try {
    const updated = await updateExperience(id, await request.json());
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update experiences error:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;
  const ok = await deleteExperience(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
