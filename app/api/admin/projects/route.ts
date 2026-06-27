import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@lib/pg-client';
import { getAdminSession } from '@lib/pg-client';

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
  const projects = await getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  if (!await requireAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    // Auto-generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    const project = await createProject({
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      category: body.category || null,
      technologies: body.technologies || [],
      github_url: body.github_url || null,
      live_url: body.live_url || null,
      cover_image: body.cover_image || null,
      is_featured: body.is_featured ?? false,
      is_published: body.is_published ?? false,
      year: body.year || String(new Date().getFullYear()),
      status: body.status || 'completed',
      sort_order: body.sort_order ?? 0,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
