import { NextRequest, NextResponse } from 'next/server';
import { getCourseBySlugAdmin, updateCourse, deleteCourseBySlug } from '@lib/pg-client';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const course = await getCourseBySlugAdmin(slug);

    if (!course) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Erreur récupération cours:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const existing = await getCourseBySlugAdmin(slug);
    if (!existing) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 });
    }

    const updated = await updateCourse(slug, {
      title: body.title,
      slug: body.slug,
      description: body.description,
      category: body.category,
      cover_image: body.cover_image,
      is_published: body.is_published,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Erreur mise à jour cours:', error);

    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const existing = await getCourseBySlugAdmin(slug);
    if (!existing) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 });
    }

    const deleted = await deleteCourseBySlug(slug);
    if (!deleted) {
      return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur suppression cours:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}