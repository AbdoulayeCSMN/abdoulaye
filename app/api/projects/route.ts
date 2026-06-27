import { NextResponse } from 'next/server';
import dbPool from '@lib/pg-client';

export async function GET() {
  try {
    const client = await dbPool.connect();
    try {
      const result = await client.query(
        `SELECT id, title, slug, description, category, technologies,
                github_url, live_url, cover_image, is_featured, year, status, sort_order
         FROM projects
         WHERE is_published = true
         ORDER BY sort_order ASC, created_at DESC`
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}
