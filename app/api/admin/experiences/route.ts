import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@lib/admin-auth';
import { listExperiences, createExperience } from '@lib/profile-db';

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  return NextResponse.json(await listExperiences(true));
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const created = await createExperience(await request.json());
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create experiences error:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
