import { NextRequest, NextResponse } from 'next/server';
import { getNoteById, updateNote, deleteNote } from '@lib/pg-client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await getNoteById(id);

    if (!note) {
      return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Erreur récupération note:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getNoteById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 });
    }

    const updated = await updateNote(id, {
      title: body.title,
      slug: body.slug,
      content: body.content,
      order_index: body.order_index,
      is_published: body.is_published,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Erreur mise à jour note:', error);

    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Ce slug existe déjà pour ce cours' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await getNoteById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 });
    }

    const deleted = await deleteNote(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur suppression note:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}