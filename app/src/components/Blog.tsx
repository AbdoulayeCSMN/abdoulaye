import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { BookOpen, Search, TrendingUp } from 'lucide-react';

/**
 * Blog component — ready for real content.
 * Wire up a CMS (Contentful, Sanity, MDX files, etc.) to populate posts.
 * Mock data has been removed; the UI renders an empty-state until posts arrive.
 */
export default function Blog() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Blog Technique</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Articles & Tutoriels</h1>
          <p className="text-lg text-muted-foreground">
            Partage de connaissances sur le développement web, les bonnes pratiques et les dernières technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-9" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <BookOpen className="h-10 w-10 text-primary mx-auto" />
                <h3 className="font-bold">Restez informé</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez les nouveaux articles directement dans votre boîte mail.
                </p>
                <Input placeholder="Votre email" className="bg-background" />
                <Button className="w-full">S&apos;abonner</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Articles
            </h2>

            {/* Empty state — replace with real posts when your CMS is connected */}
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-xl text-center gap-4">
              <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">Aucun article publié pour le moment</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Les articles apparaîtront ici dès qu&apos;ils seront publiés.
                Connectez votre CMS ou ajoutez des fichiers MDX pour commencer.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Next.js', 'TypeScript', 'React', 'Performance', 'IA'].map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
