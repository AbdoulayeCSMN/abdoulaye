'use client';

import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from '@lib/i18n';

export default function Home() {
  const t  = useTranslations('home');
  const locale = useLocale();
  const href = (path: string) => `/${locale}${path}`;

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-6 md:px-16 py-24 flex flex-col gap-32">

      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-slate-900 dark:text-slate-100">
            {t('greeting')} <span className="text-indigo-500">Abdoulaye</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8">
            {t('tagline')}
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Button asChild className="rounded-2xl px-6 py-5 text-lg font-semibold shadow-xl">
              <Link href={href('/projects')}>{t('cta_projects')}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl px-6 py-5 text-lg font-semibold">
              <Link href={href('/contact')}>
                {t('cta_contact')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/3 flex justify-center"
        >
          <div className="w-64 h-64 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 shadow-2xl" />
        </motion.div>
      </section>

      {/* About snippet */}
      <section className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
        >
          {t('about_text')}
        </motion.p>
      </section>
    </main>
  );
}
