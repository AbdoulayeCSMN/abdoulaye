import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@lib/admin-auth';
import { getSettings, saveSettings, type Settings } from '@lib/profile-db';

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  return NextResponse.json(await getSettings());
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const body = (await request.json()) as Settings;
    await saveSettings(body);
    return NextResponse.json(await getSettings());
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
