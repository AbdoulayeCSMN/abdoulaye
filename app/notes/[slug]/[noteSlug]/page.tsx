import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getCourseBySlug,
  getNoteBySlug,
  getNotesByCourseId,
  getAdjacentNotes
} from '@lib/pg-client';
import { Button } from '@components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MDXComponents } from '@components/mdx/mdx-components';
import { Separator } from '@components/ui/separator';
import { NotesSidebarLayout } from '@components/notes/NotesSidebarLayout';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; noteSlug: string }>;
}) {
  const { slug, noteSlug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Note introuvable' };
  const note = await getNoteBySlug(course.id, noteSlug);
  if (!note) return { title: 'Note introuvable' };
  return {
    title: `${note.title} - ${course.title}`,
    description: note.content.substring(0, 155),
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string; noteSlug: string }>;
}) {
  const { slug, noteSlug } = await params;

  // 1. Cours
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  // 2. Note courante
  const note = await getNoteBySlug(course.id, noteSlug);
  if (!note) notFound();

  // 3. Toutes les notes + navigation en parallèle
  const [notes, { prev, next }] = await Promise.all([
    getNotesByCourseId(course.id),
    getAdjacentNotes(course.id, note.order_index),
  ]);

  return (
    <NotesSidebarLayout
      notes={notes}
      courseSlug={slug}
      courseTitle={course.title}
      currentNoteSlug={noteSlug}
    >
      <article className="prose prose-slate dark:prose-invert max-w-none">
        {/* En-tête */}
        <div className="mb-8 not-prose">
          <p className="text-sm text-muted-foreground mb-1">{course.title}</p>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{note.title}</h1>
          <p className="text-sm text-muted-foreground">
            Mis à jour le{' '}
            {new Date(note.updated_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <Separator className="my-8" />

        <MDXRemote source={note.content} components={MDXComponents} />
      </article>

      <Separator className="my-12" />

      {/* Navigation précédent / suivant */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {prev ? (
            <Link href={`/notes/${slug}/${prev.slug}`}>
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">Précédent</p>
                  <p className="font-medium truncate">{prev.title}</p>
                </div>
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="flex-1">
          {next ? (
            <Link href={`/notes/${slug}/${next.slug}`}>
              <Button variant="outline" className="w-full justify-end gap-3 h-auto py-3">
                <div className="text-right min-w-0">
                  <p className="text-xs text-muted-foreground">Suivant</p>
                  <p className="font-medium truncate">{next.title}</p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href={`/notes/${slug}`}>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            ← Retour au cours
          </Button>
        </Link>
      </div>
    </NotesSidebarLayout>
  );
}