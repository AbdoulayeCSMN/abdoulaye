import { notFound } from 'next/navigation';
import { routing } from '@lib/i18n/routing';
import { I18nProvider } from '@lib/i18n';
import type { Locale, Messages } from '@lib/i18n';
import PortfolioHeader from '@components/Header';
import PortfolioFooter from '@components/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function loadMessages(locale: string): Promise<Messages> {
  if (locale === 'en') {
    return (await import('../../messages/en.json')).default as unknown as Messages;
  }
  return (await import('../../messages/fr.json')).default as unknown as Messages;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await loadMessages(locale);

  return (
    <I18nProvider locale={locale as Locale} messages={messages}>
      <PortfolioHeader />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <PortfolioFooter />
    </I18nProvider>
  );
}
