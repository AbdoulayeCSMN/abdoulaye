'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  MessageSquare,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/admin/projects', label: 'Projets', icon: FolderKanban },
  { href: '/admin/courses', label: 'Cours', icon: BookOpen },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/admin/projects" className="font-bold text-primary mr-4 text-sm uppercase tracking-wider">
            Admin
          </Link>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? 'secondary' : 'ghost'}
                size="sm"
                className={cn('gap-2', pathname === href && 'font-semibold')}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button variant="ghost" size="sm">Voir le site</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  );
}
