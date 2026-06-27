import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@lib/pg-client';
import dbPool from '@lib/pg-client';

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  const session = await getAdminSession(token);
  return !!session;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const client = await dbPool.connect();
  try {
    const result = await client.query(
      'UPDATE messages SET is_read = $1 WHERE id = $2 RETURNING *',
      [body.is_read, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const client = await dbPool.connect();
  try {
    await client.query('DELETE FROM messages WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}
