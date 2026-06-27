import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@lib/pg-client';
import dbPool from '@lib/pg-client';

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  const session = await getAdminSession(token);
  return !!session;
}

export async function GET(request: NextRequest) {
  if (!await requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const client = await dbPool.connect();
  try {
    const result = await client.query('SELECT * FROM messages ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } finally {
    client.release();
  }
}
