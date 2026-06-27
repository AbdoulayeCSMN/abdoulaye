import { NextRequest, NextResponse } from 'next/server';
import { getCourses, createCourse } from '@lib/pg-client';

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erreur récupération cours:', error);
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
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Le titre et le slug sont requis' },
        { status: 400 }
      );
    }

    const course = await createCourse({
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      category: body.category || null,
      cover_image: body.cover_image || null,
      is_published: body.is_published ?? true,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création cours:', error);

    // Gestion des contraintes d'unicité (slug dupliqué)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ce slug existe déjà' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}