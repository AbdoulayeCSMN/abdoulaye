import { NextRequest, NextResponse } from 'next/server';
import { getNotesByCourseId,
  createNote,
  getCourseBySlugAdmin } from '@lib/pg-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get('course_slug');

    if (!courseSlug) {
      return NextResponse.json(
        { error: 'Le paramètre course_slug est requis' },
        { status: 400 }
      );
    }

    // Récupérer l'ID du cours à partir du slug
    const course = await getCourseBySlugAdmin(courseSlug);
    if (!course) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    const { getAllNotesByCourseSlug } = await import('@lib/pg-client');
    const notes = await getAllNotesByCourseSlug(courseSlug);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Erreur récupération notes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des champs requis
    if (!body.course_slug || !body.title || !body.slug || !body.content || body.order_index === undefined) {
      return NextResponse.json(
        { error: 'course_slug, titre, slug, contenu et ordre sont requis' },
        { status: 400 }
      );
    }

    // Récupérer l'ID du cours
    const course = await getCourseBySlugAdmin(body.course_slug);
    if (!course) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    const note = await createNote({
      course_id: course.id,
      title: body.title,
      slug: body.slug,
      content: body.content,
      order_index: body.order_index,
      is_published: body.is_published ?? true,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création note:', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ce slug existe déjà pour ce cours' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
