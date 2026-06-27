import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '@lib/pg-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation basique
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Completez le formulaire !' },
        { status: 400 }
      );
    }

    const message = await createMessage({
      nom: body.name,
      email: body.email,
      tel: body.phone || null,
      objet: body.subject,
      content: body.message,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création cours:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}