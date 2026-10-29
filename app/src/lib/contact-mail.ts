/** Notification par email (Resend, via l'API REST — aucune dépendance). */

export interface ContactMail {
  nom: string;
  email: string;
  tel?: string | null;
  objet: string;
  content: string;
  locale?: string;
  createdAt: Date;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export type MailStatus = 'sent' | 'not_configured' | 'failed';

export async function sendContactMail(m: ContactMail): Promise<MailStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.warn('Email non envoyé : RESEND_API_KEY ou CONTACT_TO_EMAIL manquant');
    return 'not_configured';
  }
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
  const when = m.createdAt.toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca', dateStyle: 'full', timeStyle: 'short' });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'portfolio';

  const text = [
    `Nouveau message reçu depuis ton portfolio (${origin}).`,
    '',
    `De : ${oneLine(m.nom)} <${oneLine(m.email)}>`,
    m.tel ? `Téléphone : ${oneLine(m.tel)}` : null,
    `Sujet : ${oneLine(m.objet)}`,
    `Reçu le : ${when}`,
    m.locale ? `Langue de la page : ${m.locale}` : null,
    '',
    m.content,
    '',
    '— Réponds directement à cet email : la réponse ira à l\'expéditeur.',
  ].filter((l) => l !== null).join('\n');

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;line-height:1.5">
<p style="background:#0f7b5f;color:#fff;padding:8px 12px;border-radius:4px;margin:0 0 12px">
  Message reçu depuis ton <strong>portfolio</strong></p>
<table style="font-size:14px;border-collapse:collapse">
<tr><td style="padding:2px 12px 2px 0;color:#666">De</td><td><strong>${esc(oneLine(m.nom))}</strong> &lt;<a href="mailto:${esc(oneLine(m.email))}">${esc(oneLine(m.email))}</a>&gt;</td></tr>
${m.tel ? `<tr><td style="padding:2px 12px 2px 0;color:#666">Téléphone</td><td>${esc(oneLine(m.tel))}</td></tr>` : ''}
<tr><td style="padding:2px 12px 2px 0;color:#666">Sujet</td><td>${esc(oneLine(m.objet))}</td></tr>
<tr><td style="padding:2px 12px 2px 0;color:#666">Reçu le</td><td>${esc(when)}</td></tr>
${m.locale ? `<tr><td style="padding:2px 12px 2px 0;color:#666">Langue</td><td>${esc(m.locale)}</td></tr>` : ''}
</table>
<div style="margin-top:14px;padding:12px;border:1px solid #ddd;border-radius:4px;white-space:pre-wrap">${esc(m.content)}</div>
<p style="color:#888;font-size:12px">Réponds directement à cet email : la réponse ira à l'expéditeur.</p>
</div>`;

  try {
    const res = await fetch(process.env.RESEND_API_URL || 'https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: oneLine(m.email),
        subject: `[Portfolio] ${oneLine(m.objet).slice(0, 120)} — ${oneLine(m.nom).slice(0, 60)}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('Resend error', res.status, await res.text().catch(() => ''));
      return 'failed';
    }
    return 'sent';
  } catch (e) {
    console.error('Resend exception', e);
    return 'failed';
  }
}
