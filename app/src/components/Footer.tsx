'use client';

import Link from 'next/link';
import { Button } from '@components/ui/button';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { Separator } from '@components/ui/separator';
import { useTranslations, useLocale } from '@lib/i18n';

export default function PortfolioFooter() {
  const t  = useTranslations('footer');
  const tn = useTranslations('nav');
  const locale = useLocale();
  const href = (path: string) => `/${locale}${path}`;

  const quickLinks = [
    { label: tn('home'),     to: href('/') },
    { label: tn('projects'), to: href('/projects') },
    { label: tn('about'),    to: href('/about') },
    { label: tn('contact'),  to: href('/contact') },
  ];

  const socialLinks = [
    { platform: 'GitHub (AbdoulayeCSMN)', url: 'https://github.com/AbdoulayeCSMN', icon: <FaGithub className="h-5 w-5" /> },
    { platform: 'GitHub (OrlCheetah)',    url: 'https://github.com/OrlCheetah',    icon: <FaGithub className="h-5 w-5" /> },
    { platform: 'LinkedIn',               url: 'https://www.linkedin.com/in/abdoulaye-chaibou-26bb963aa', icon: <FaLinkedin className="h-5 w-5" /> },
    { platform: 'Twitter / X',             url: 'https://x.com/TechAbdoulaye', icon: <FaXTwitter className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href={href('/')} className="inline-block group">
              <span className="font-mono-tight text-base text-muted-foreground group-hover:text-primary transition-colors">
                <span className="text-primary">~</span>/abdoulaye
              </span>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">{t('tagline')}</p>
            </Link>
            <div className="space-y-2.5">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:a.chaibousaidou@edu.umi.ac.ma" className="text-sm hover:text-primary transition-colors">
                  a.chaibousaidou@edu.umi.ac.ma
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+212710970324" className="text-sm hover:text-primary transition-colors">
                  +212 7 10 97 03 24
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Meknès, Maroc</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('quick_links')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link href={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Réseaux sociaux</h4>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted hover:bg-primary/10 hover:text-primary p-2 rounded-sm transition-colors"
                  aria-label={social.platform}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Chaibou Abdoulaye. {t('rights')}.
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-muted-foreground hover:text-primary gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            Haut de page
          </Button>
        </div>
      </div>
    </footer>
  );
}
