import { NextRequest, NextResponse } from 'next/server';
import { getCurrentDocument, incrementDownload } from '@lib/profile-db';

// Lien public stable : /cv/<slug>.<pdf|docx>  (ex. /cv/ml-en.pdf)
export const dynamic = 'force-dynamic';

const FILE_RE = /^([a-z0-9][a-z0-9-]{1,39})\.(pdf|docx)$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const m = FILE_RE.exec(file);
  if (!m) return new NextResponse('Not found', { status: 404 });

  try {
    const doc = await getCurrentDocument(m[1], m[2]);
    if (!doc) return new NextResponse('Not found', { status: 404 });
    incrementDownload(doc.id).catch(() => {});

    const safeName = doc.filename.replace(/[^A-Za-z0-9._-]/g, '_');
    return new NextResponse(new Uint8Array(doc.data), {
      status: 200,
      headers: {
        'Content-Type': doc.mime,
        'Content-Length': String(doc.data.length),
        // PDF affiché dans le navigateur ; DOCX téléchargé
        'Content-Disposition': `${m[2] === 'pdf' ? 'inline' : 'attachment'}; filename="${safeName}"`,
        'X-Content-Type-Options': 'nosniff',
        // Toujours la dernière version : le lien envoyé aux recruteurs ne change jamais
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('CV download error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
