import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@lib/admin-auth';
import { deleteDocument, makeDocumentCurrent } from '@lib/profile-db';

/** Restaure une ancienne version comme version courante. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;
  const doc = await makeDocumentCurrent(id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;
  const ok = await deleteDocument(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
