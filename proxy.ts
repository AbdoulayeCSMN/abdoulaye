import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['fr', 'en'] as const;
const DEFAULT_LOCALE = 'fr';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through: admin, API, static files, Next internals
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if path already has a locale prefix
  const pathnameLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameLocale) {
    // Already has locale — pass through
    return NextResponse.next();
  }

  // Detect preferred locale from Accept-Language header
  const acceptLang = request.headers.get('accept-language') ?? '';
  const preferred = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase();
  const locale = LOCALES.includes(preferred as 'fr' | 'en') ? preferred : DEFAULT_LOCALE;

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
