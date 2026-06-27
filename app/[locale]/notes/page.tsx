import Link from 'next/link';
import { getCourses } from '@lib/pg-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';

export const revalidate = 3600; // Revalider toutes les heures

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Mes Cours & Notes</h1>
        <p className="text-lg text-muted-foreground">
          Découvrez mes cours et notes de développement
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun cours disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/notes/${course.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
                {course.cover_image && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    {course.category && (
                      <Badge variant="secondary">{course.category}</Badge>
                    )}
                  </div>
                  {course.description && (
                    <CardDescription className="mt-2">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(course.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}