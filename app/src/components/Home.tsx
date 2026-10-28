'use client';

import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from '@lib/i18n';

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  const href = (path: string) => `/${locale}${path}`;

  return (
    <main className="min-h-screen w-full px-6 md:px-16 pt-32 pb-24 flex flex-col gap-24">

      {/* Hero */}
      <section className="grid md:grid-cols-[1fr_auto] gap-12 items-start max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="path-label mb-4">~/home</p>

          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-6 max-w-2xl">
            {t('greeting')} <span className="text-primary">Abdoulaye</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
            {t('tagline')}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Button asChild className="rounded-sm px-5 h-11 font-mono-tight text-sm">
              <Link href={href('/projects')}>{t('cta_projects')}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-sm px-5 h-11 font-mono-tight text-sm border-border">
              <Link href={href('/contact')}>
                {t('cta_contact')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Fact block — replaces the decorative gradient blob with actual signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full md:w-72 border border-border rounded-md bg-card font-mono-tight text-sm"
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
            <span className="h-2 w-2 rounded-full bg-destructive/70" />
            <span className="h-2 w-2 rounded-full bg-accent/70" />
            <span className="h-2 w-2 rounded-full bg-primary/70" />
            <span className="ml-2 text-xs text-muted-foreground">whoami.txt</span>
          </div>
          <dl className="px-4 py-4 flex flex-col gap-3 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">role</dt>
              <dd className="text-right">AI &amp; Data Eng.</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">school</dt>
              <dd className="text-right">ENSAM Meknès</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">stack</dt>
              <dd className="text-right">Python · C++ · Rust</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">status</dt>
              <dd className="text-right text-accent">open to internship</dd>
            </div>
          </dl>
        </motion.div>
      </section>

      {/* About snippet */}
      <section className="max-w-2xl border-l-2 border-primary pl-6">
        <p className="path-label mb-3">~/about</p>
        <p className="text-base text-muted-foreground leading-relaxed">
          {t('about_text')}
        </p>
      </section>
    </main>
  );
}
