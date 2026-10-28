'use client';

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { FaGithub } from 'react-icons/fa';
import {
  ExternalLink, Eye, Code, Palette, Server,
  Calendar, Star, Grid, List, Zap, Smartphone,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslations } from '@lib/i18n';

interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  cover_image?: string;
  is_featured: boolean;
  year?: string;
  status?: string;
  sort_order: number;
}

// Category tags render as monospace labels, not decorative color blocks —
// the accent lives in the border, everything else stays neutral.
const CATEGORY_LABEL: Record<string, string> = {
  frontend: 'frontend', backend: 'backend', fullstack: 'fullstack',
  mobile: 'mobile', timesseries: 'time-series', design: 'design',
  nlp: 'nlp', cv: 'vision', rl: 'rl', resarch: 'research', other: 'systems',
};

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all',      label: t('filter_all'),      icon: <Grid className="h-4 w-4" /> },
    { id: 'featured', label: t('filter_featured'),  icon: <Star className="h-4 w-4" /> },
    { id: 'frontend', label: t('filter_frontend'),  icon: <Code className="h-4 w-4" /> },
    { id: 'backend',  label: t('filter_backend'),   icon: <Server className="h-4 w-4" /> },
    { id: 'fullstack',label: t('filter_fullstack'), icon: <Zap className="h-4 w-4" /> },
    { id: 'design',   label: t('filter_design'),    icon: <Palette className="h-4 w-4" /> },
    { id: 'mobile',   label: t('filter_mobile'),    icon: <Smartphone className="h-4 w-4" /> },
  ];

  const filtered = activeCategory === 'all'
    ? projects
    : activeCategory === 'featured'
    ? projects.filter((p) => p.is_featured)
    : projects.filter((p) => p.category === activeCategory);

  const statusLabel = (status?: string) => {
    if (status === 'live')        return t('status_live');
    if (status === 'in_progress') return t('status_in_progress');
    return t('status_completed');
  };

  const catLabel = (category?: string) => CATEGORY_LABEL[category ?? 'other'] ?? 'systems';

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="path-label mb-3">~/projects</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-base text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="flex-wrap h-auto">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2"
                >
                  {cat.icon}
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>{t('no_projects')}</p>
          </div>
        )}

        {/* Grid / List */}
        {!loading && filtered.length > 0 && (
          <div className={view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filtered.map((project) => (
              <Card
                key={project.id}
                className={`group rounded-md border-border hover:border-primary/60 transition-colors duration-200 ${
                  view === 'grid' ? 'flex flex-col' : 'flex'
                }`}
              >
                {view === 'grid' ? (
                  <>
                    <div className="px-6 pt-5 flex items-center justify-between gap-2">
                      <span className="path-label">{catLabel(project.category)}</span>
                      <div className="flex items-center gap-2">
                        {project.is_featured && (
                          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                        )}
                        <Badge variant={project.status === 'live' ? 'default' : 'secondary'} className="rounded-sm">
                          {statusLabel(project.status)}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="flex-1">
                      {project.year && (
                        <div className="flex items-center gap-1 mb-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{project.year}</span>
                        </div>
                      )}
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies ?? []).slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                        {(project.technologies ?? []).length > 3 && (
                          <Badge variant="outline" className="text-xs">+{(project.technologies ?? []).length - 3}</Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4">
                      <div className="flex gap-2 w-full">
                        {project.github_url && (
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <FaGithub className="h-4 w-4 mr-2" />{t('btn_code')}
                            </a>
                          </Button>
                        )}
                        {project.live_url && (
                          <Button size="sm" className="flex-1" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />{t('btn_visit')}
                            </a>
                          </Button>
                        )}
                        {!project.live_url && !project.github_url && (
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />{t('btn_details')}
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 bg-primary/50 hidden md:block flex-shrink-0" />
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="path-label">{catLabel(project.category)}</span>
                          <Badge variant={project.status === 'live' ? 'default' : 'secondary'} className="rounded-sm">
                            {statusLabel(project.status)}
                          </Badge>
                          {project.is_featured && (
                            <Badge variant="outline" className="rounded-sm"><Star className="h-3 w-3 mr-1" />Featured</Badge>
                          )}
                          {project.year && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />{project.year}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-base">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.technologies ?? []).map((tech) => (
                            <Badge key={tech} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {project.github_url && (
                            <Button variant="outline" asChild>
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                <FaGithub className="h-4 w-4 mr-2" />{t('btn_code')}
                              </a>
                            </Button>
                          )}
                          {project.live_url && (
                            <Button asChild>
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />{t('btn_visit')}
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Stats : uniquement des chiffres vérifiables (compte réel en base) */}
        {!loading && projects.length > 0 && (
          <div className="mt-16 grid grid-cols-2 border-t border-l border-border">
            {[
              { label: t('stats_completed'), value: String(projects.length) },
              { label: t('stats_in_progress'), value: String(projects.filter((p) => p.status === 'in_progress').length) },
            ].map(({ label, value }) => (
              <div key={label} className="border-r border-b border-border px-6 py-8">
                <div className="text-3xl font-semibold font-mono-tight mb-2 text-primary">{value}</div>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

