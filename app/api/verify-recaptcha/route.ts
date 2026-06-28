import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken } = await request.json();

    if (!recaptchaToken) {
      return NextResponse.json({ success: false, error: 'Token manquant' }, { status: 400 });
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      console.error('RECAPTCHA_SECRET_KEY non défini');
      return NextResponse.json({ success: false, error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: recaptchaToken }),
    });

    const result = await verifyResponse.json();

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Vérification reCAPTCHA échouée' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying recaptcha:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
