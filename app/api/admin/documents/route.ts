import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@lib/admin-auth';
import { addDocumentVersion, listDocuments, updateDocumentMeta } from '@lib/profile-db';
import { MAX_DOC_BYTES, SLUG_RE, defaultLabel } from '@lib/cv-profiles';

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  return NextResponse.json(await listDocuments());
}

const MIME = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

/** Téléversement d'un CV : crée une nouvelle version, qui devient la version courante. */
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get('file');
    const slug = String(form.get('slug') ?? '').trim().toLowerCase();
    if (!(file instanceof File)) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    if (!SLUG_RE.test(slug)) {
      return NextResponse.json({ error: 'Identifiant invalide (a-z, 0-9, tirets ; 2 à 40 caractères)' }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_DOC_BYTES) {
      return NextResponse.json({ error: 'Fichier vide ou supérieur à 5 Mo' }, { status: 400 });
    }

    const data = Buffer.from(await file.arrayBuffer());
    // Le format est déterminé par le contenu réel, pas par le nom du fichier
    let format: 'pdf' | 'docx' | null = null;
    if (data.subarray(0, 5).toString('latin1') === '%PDF-') format = 'pdf';
    else if (data.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])) && file.name.toLowerCase().endsWith('.docx')) format = 'docx';
    if (!format) return NextResponse.json({ error: 'Seuls les PDF et DOCX sont acceptés' }, { status: 400 });

    const label_fr = String(form.get('label_fr') ?? '').trim().slice(0, 200) || defaultLabel(slug, 'fr');
    const label_en = String(form.get('label_en') ?? '').trim().slice(0, 200) || defaultLabel(slug, 'en');
    const is_public = String(form.get('is_public') ?? 'true') !== 'false';

    const created = await addDocumentVersion({
      slug, format, label_fr, label_en,
      filename: file.name.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120),
      mime: MIME[format], data, is_public,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** Libellés et visibilité d'un (slug, format). */
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin(request))) return unauthorized();
  const b = await request.json();
  if (!SLUG_RE.test(String(b.slug)) || !['pdf', 'docx'].includes(b.format)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const ok = await updateDocumentMeta(b.slug, b.format, {
    label_fr: typeof b.label_fr === 'string' ? b.label_fr.slice(0, 200) : undefined,
    label_en: typeof b.label_en === 'string' ? b.label_en.slice(0, 200) : undefined,
    is_public: typeof b.is_public === 'boolean' ? b.is_public : undefined,
  });
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
