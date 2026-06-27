import { NextRequest, NextResponse } from 'next/server';
import { deleteAdminSession } from '@lib/pg-client';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (token) {
    try { await deleteAdminSession(token); } catch {}
  }
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
