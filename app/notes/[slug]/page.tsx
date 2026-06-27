import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourseBySlug, getNotesByCourseId, getCourses } from '@lib/pg-client';
import { Card, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const revalidate = 3600;
export const dynamicParams = true;

// Générer les routes statiques
export async function generateStaticParams() {
  try {
    const courses = await getCourses();
    return courses.map((course) => ({
      slug: course.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Générer les métadonnées - IMPORTANT: await params
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  
  if (!course) {
    return {
      title: 'Cours introuvable',
    };
  }

  return {
    title: course.title,
    description: course.description || `Cours: ${course.title}`,
  };
}

// Page component - IMPORTANT: await params
export default async function CoursePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  console.log('CoursePage - slug:', slug);
  
  const course = await getCourseBySlug(slug);

  if (!course) {
    console.log('Course not found for slug:', slug);
    notFound();
  }

  const notes = await getNotesByCourseId(course.id);
  console.log('Found notes:', notes.length);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/notes">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Button>
      </Link>

      <div className="mb-8">
        {course.cover_image && (
          <div className="mb-6 aspect-video overflow-hidden rounded-lg">
            <img
              src={course.cover_image}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
        {course.description && (
          <p className="text-lg text-muted-foreground">{course.description}</p>
        )}
      </div>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold">Contenu du cours</h2>
        {notes.length === 0 ? (
          <p className="text-muted-foreground">Aucune leçon disponible pour ce cours.</p>
        ) : (
          <div className="grid gap-4">
            {notes.map((note, index) => (
              <Link
                key={note.id}
                href={`/notes/${slug}/${note.slug}`}
              >
                <Card className="transition-all hover:shadow-md hover:border-primary">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {index + 1}. {note.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Ajouté le {new Date(note.created_at).toLocaleDateString('fr-FR')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}