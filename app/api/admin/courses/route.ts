// app/api/admin/courses/route.ts
// Route dédiée à l'admin — retourne TOUS les cours (publiés et brouillons)
import { NextResponse } from 'next/server';
import { getAllCourses } from '@lib/pg-client';

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Erreur récupération cours (admin):', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}