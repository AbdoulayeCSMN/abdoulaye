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
    `Nouveau message reçu depuis mon portfolio (${origin}).`,
    '',
    `De : ${oneLine(m.nom)} <${oneLine(m.email)}>`,
    m.tel ? `Téléphone : ${oneLine(m.tel)}` : null,
    `Sujet : ${oneLine(m.objet)}`,
    `Reçu le : ${when}`,
    m.locale ? `Langue de la page : ${m.locale}` : null,
    '',
    m.content,
    '',
    '',
  ].filter((l) => l !== null).join('\n');

  const html = `
<div style="margin:0;padding:40px 15px;background-color:#f3f5f9;font-family:Arial,Helvetica,sans-serif;color:#172033;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #e7eaf0;border-collapse:separate;overflow:hidden;">

    <!-- HEADER -->
    <tr>
      <td style="background:#102a43;padding:32px 36px;color:#ffffff;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>
              <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9fb3c8;font-weight:bold;">
                PORTFOLIO
              </div>

              <h1 style="margin:15px 0 8px;font-size:25px;line-height:1.3;font-weight:700;color:#ffffff;">
                Nouveau message reçu
              </h1>

              <p style="margin:0;font-size:14px;line-height:1.6;color:#cbd5e1;">
                Une nouvelle personne souhaite entrer en contact avec vous.
              </p>
            </td>

            <td width="55" align="right" valign="top">
              <div style="width:42px;height:42px;line-height:42px;text-align:center;border-radius:12px;background:#1d4568;color:#ffffff;font-size:21px;">
                &#9993;
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- STATUS -->
    <tr>
      <td style="padding:25px 36px 5px;">
        <span style="display:inline-block;padding:7px 12px;background:#e8f7ef;color:#16834b;border-radius:20px;font-size:12px;font-weight:bold;">
          &#9679; NOUVELLE DEMANDE DE CONTACT
        </span>
      </td>
    </tr>

    <!-- INTRO -->
    <tr>
      <td style="padding:18px 36px 10px;">
        <h2 style="margin:0 0 8px;font-size:18px;color:#172033;">
          Informations de l'expéditeur
        </h2>

        <p style="margin:0;font-size:13px;color:#8491a3;line-height:1.6;">
          Voici les coordonnées de la personne qui vous a envoyé ce message.
        </p>
      </td>
    </tr>

    <!-- CONTACT DETAILS -->
    <tr>
      <td style="padding:12px 36px 22px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="background:#f8fafc;border:1px solid #e8edf3;border-collapse:separate;border-radius:10px;">

          <tr>
            <td style="padding:15px 18px;border-bottom:1px solid #e8edf3;">
              <div style="font-size:11px;color:#8491a3;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                Nom complet
              </div>
              <div style="font-size:15px;font-weight:bold;color:#172033;">
                ${esc(oneLine(m.nom))}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:15px 18px;border-bottom:1px solid #e8edf3;">
              <div style="font-size:11px;color:#8491a3;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                Adresse e-mail
              </div>
              <div style="font-size:14px;color:#2563eb;">
                <a href="mailto:${esc(oneLine(m.email))}" style="color:#2563eb;text-decoration:none;">
                  ${esc(oneLine(m.email))}
                </a>
              </div>
            </td>
          </tr>

          ${m.tel ? `
          <tr>
            <td style="padding:15px 18px;border-bottom:1px solid #e8edf3;">
              <div style="font-size:11px;color:#8491a3;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                Téléphone
              </div>
              <div style="font-size:14px;color:#172033;">
                ${esc(oneLine(m.tel))}
              </div>
            </td>
          </tr>
          ` : ''}

          <tr>
            <td style="padding:15px 18px;">
              <div style="font-size:11px;color:#8491a3;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                Objet de la demande
              </div>
              <div style="font-size:14px;font-weight:600;color:#172033;">
                ${esc(oneLine(m.objet))}
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>

    <!-- MESSAGE -->
    <tr>
      <td style="padding:5px 36px 28px;">

        <h2 style="margin:0 0 13px;font-size:18px;color:#172033;">
          Contenu du message
        </h2>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background:#f8fafc;border-left:4px solid #2563eb;border-radius:5px;padding:20px 22px;font-size:14px;line-height:1.8;color:#334155;white-space:pre-wrap;overflow-wrap:anywhere;">
              ${esc(m.content)}
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- METADATA -->
    <tr>
      <td style="padding:0 36px 28px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="border-top:1px solid #edf0f4;">

          <tr>
            <td style="padding:12px 0;font-size:12px;color:#8491a3;">
              Date de réception
            </td>
            <td align="right" style="padding:12px 0;font-size:12px;color:#334155;font-weight:600;">
              ${esc(when)}
            </td>
          </tr>

          ${m.locale ? `
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#8491a3;">
              Langue du formulaire
            </td>
            <td align="right" style="padding:8px 0;font-size:12px;color:#334155;font-weight:600;">
              ${esc(m.locale)}
            </td>
          </tr>
          ` : ''}

          <tr>
            <td style="padding:8px 0;font-size:12px;color:#8491a3;">
              Site d'origine
            </td>
            <td align="right" style="padding:8px 0;font-size:12px;color:#334155;font-weight:600;">
              ${esc(origin)}
            </td>
          </tr>

        </table>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#f8fafc;border-top:1px solid #edf0f4;padding:24px 36px;text-align:center;">

        <p style="margin:0 0 7px;font-size:13px;font-weight:bold;color:#334155;">
          Notification automatique
        </p>

        <p style="margin:0;font-size:11px;line-height:1.7;color:#94a3b8;">
          Cet e-mail a été généré automatiquement à la suite d'un message envoyé depuis votre portfolio.<br>
          Vous pouvez répondre directement à cet e-mail pour contacter son expéditeur.
        </p>

      </td>
    </tr>

  </table>

  <!-- OUTER FOOTER -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="max-width:650px;margin:18px auto 0;">
    <tr>
      <td align="center" style="font-size:11px;color:#a0a9b7;">
        Portfolio · Notification de contact
      </td>
    </tr>
  </table>

</div>
`;

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
