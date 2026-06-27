import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@lib/pg-client';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  try {
    const session = await getAdminSession(token);
    if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
