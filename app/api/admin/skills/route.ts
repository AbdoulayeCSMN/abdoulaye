import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@lib/admin-auth';
import { listSkills, createSkill } from '@lib/profile-db';

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  return NextResponse.json(await listSkills(true));
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const created = await createSkill(await request.json());
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create skills error:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
