import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@lib/pg-client';

/** Vérifie le cookie de session admin (même logique que les routes existantes). */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  const session = await getAdminSession(token);
  return !!session;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
