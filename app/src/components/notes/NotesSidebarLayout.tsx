// components/notes/NotesSidebarLayout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import { PanelLeft, BookOpen, ChevronRight } from 'lucide-react';

interface Note {
  id: string;
  slug: string;
  title: string;
  order_index: number;
}

interface NotesSidebarLayoutProps {
  notes: Note[];
  courseSlug: string;
  courseTitle: string;
  currentNoteSlug: string;
  children: React.ReactNode;
}

export function NotesSidebarLayout({
  notes,
  courseSlug,
  courseTitle,
  currentNoteSlug,
  children,
}: NotesSidebarLayoutProps) {
  const [open, setOpen] = useState(true);

  return (
    // Pleine largeur, hauteur viewport moins le header (ajustez 4rem si votre header a une autre hauteur)
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">

      {/* ── Sidebar — cachée sur mobile ── */}
      <aside
        className={cn(
          // Cachée sur mobile, visible à partir de md
          'hidden md:flex flex-col flex-shrink-0 border-r bg-background',
          'transition-[width] duration-300 ease-in-out overflow-hidden',
          open ? 'w-64 lg:w-72' : 'w-0 border-r-0'
        )}
      >
        {/* En-tête sidebar */}
        <div className="flex h-14 flex-shrink-0 items-center gap-2 border-b px-4">
          <BookOpen className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="truncate text-sm font-semibold leading-tight">{courseTitle}</span>
        </div>

        {/* Liste des notes — scroll indépendant */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="flex flex-col gap-0.5">
            {notes.map((note, index) => {
              const isActive = note.slug === currentNoteSlug;
              return (
                <Link
                  key={note.id}
                  href={`/notes/${courseSlug}/${note.slug}`}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {/* Numéro de la note */}
                  <span
                    className={cn(
                      'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-medium',
                      isActive
                        ? 'bg-white/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-accent-foreground/10'
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 line-clamp-2 leading-tight">{note.title}</span>
                  {isActive && <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-70" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* ── Zone principale ── */}
      <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Bouton toggle — visible uniquement sur md+ */}
        <div className="hidden md:block absolute left-3 top-3 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen(prev => !prev)}
            className="h-8 w-8 rounded-md shadow-sm"
            aria-label={open ? 'Fermer la sidebar' : 'Ouvrir la sidebar'}
          >
            <PanelLeft
              className={cn(
                'h-4 w-4 transition-transform duration-300',
                !open && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Contenu principal — scroll indépendant */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 md:pt-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}