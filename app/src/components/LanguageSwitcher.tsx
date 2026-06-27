'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from path: /fr/... or /en/...
  const segments = pathname.split('/');
  const currentLocale = segments[1] === 'en' ? 'en' : 'fr';

  function switchLocale(newLocale: string) {
    if (newLocale === currentLocale) return;
    // Replace /fr/... with /en/... or vice versa
    const rest = segments.slice(2).join('/');
    const newPath = `/${newLocale}${rest ? `/${rest}` : ''}`;
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-1 border rounded-full px-1 py-0.5 bg-muted/40">
      <Button
        variant={currentLocale === 'fr' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2 rounded-full text-xs font-semibold"
        onClick={() => switchLocale('fr')}
        aria-label="Français"
      >
        FR
      </Button>
      <Button
        variant={currentLocale === 'en' ? 'default' : 'ghost'}
        size="sm"
        className="h-7 px-2 rounded-full text-xs font-semibold"
        onClick={() => switchLocale('en')}
        aria-label="English"
      >
        EN
      </Button>
    </div>
  );
}
