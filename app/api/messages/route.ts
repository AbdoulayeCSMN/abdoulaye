import { NextRequest, NextResponse } from 'next/server';
import dbPool from '@lib/pg-client';
import { sendContactMail } from '@lib/contact-mail';

export const dynamic = 'force-dynamic';

// Limite simple par IP (best-effort : mémoire de l'instance serverless)
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

async function captchaOk(token: unknown): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // captcha non configuré : on ne bloque pas
  if (typeof token !== 'string' || !token) return false;
  try {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(6000),
    });
    return !!(await r.json()).success;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });

    // Champ piège : invisible pour un humain, rempli par les robots → on fait semblant d'accepter
    if (body.website) return NextResponse.json({ ok: true }, { status: 201 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (tooMany(ip)) return NextResponse.json({ error: 'Trop de messages, réessaie plus tard.' }, { status: 429 });

    const nom = clip(body.name, 120);
    const email = clip(body.email, 200);
    const tel = clip(body.phone, 50) || null;
    const objet = clip(body.subject, 200);
    const content = clip(body.message, 5000);
    const locale = ['fr', 'en'].includes(body.locale) ? body.locale : null;

    if (nom.length < 2 || !EMAIL_RE.test(email) || objet.length < 3 || content.length < 10) {
      return NextResponse.json({ error: 'Formulaire incomplet ou invalide' }, { status: 400 });
    }
    if (!(await captchaOk(body.recaptchaToken))) {
      return NextResponse.json({ error: 'Vérification anti-robot échouée' }, { status: 400 });
    }

    // 1) toujours enregistrer en base
    const { rows } = await dbPool.query(
      `INSERT INTO messages (nom, email, tel, objet, content) VALUES ($1,$2,$3,$4,$5) RETURNING id, created_at`,
      [nom, email, tel, objet, content],
    );

    // 2) puis notifier par email ; un échec d'email ne fait pas échouer le message
    const status = await sendContactMail({ nom, email, tel, objet, content, locale: locale ?? undefined, createdAt: new Date(rows[0].created_at) });

    // 3) trace (colonnes ajoutées par migrate-003 ; ignorées si la migration n'est pas appliquée)
    await dbPool
      .query('UPDATE messages SET email_status = $2, locale = $3 WHERE id = $1', [rows[0].id, status, locale])
      .catch(() => undefined);

    return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Erreur création message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
