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
  Users, Calendar, Star, Grid, List, Zap, Smartphone,
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

const COLOR_MAP: Record<string, string> = {
  frontend:  'from-blue-500 to-cyan-500',
  backend:   'from-green-500 to-emerald-500',
  fullstack: 'from-indigo-500 to-purple-500',
  mobile:    'from-orange-500 to-rose-500',
  timesseries:    'from-orange-500 to-rose-500',
  design:    'from-pink-500 to-fuchsia-500',
  nlp:       'from-slate-500 to-slate-700',
  cv:        'from-pink-500 to-fuchsia-500',
  rl:        'from-pink-500 to-fuchsia-500',
  resarch:   'from-pink-500 to-fuchsia-500',
  other:     'from-slate-500 to-slate-700'
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
    if (status === 'live')        return `🌐 ${t('status_live')}`;
    if (status === 'in_progress') return `🔧 ${t('status_in_progress')}`;
    return `✅ ${t('status_completed')}`;
  };

  const color = (category?: string) => COLOR_MAP[category ?? 'other'] ?? COLOR_MAP.other;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Code className="h-4 w-4" />
            <span className="text-sm font-medium">{t('badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
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
                className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 ${
                  view === 'grid' ? 'flex flex-col hover:-translate-y-2' : 'flex'
                }`}
              >
                {view === 'grid' ? (
                  <>
                    <div className={`h-48 bg-linear-to-br ${color(project.category)} relative overflow-hidden rounded-t-lg`}>
                      {project.cover_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.cover_image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge variant={project.status === 'live' ? 'default' : 'secondary'}>
                          {statusLabel(project.status)}
                        </Badge>
                      </div>
                      {project.is_featured && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="outline" className="bg-background/80">
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </Badge>
                        </div>
                      )}
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
                    <div className={`w-40 bg-linear-to-br ${color(project.category)} hidden md:block rounded-l-lg flex-shrink-0`} />
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Badge variant={project.status === 'live' ? 'default' : 'secondary'}>
                            {statusLabel(project.status)}
                          </Badge>
                          {project.is_featured && (
                            <Badge variant="outline"><Star className="h-3 w-3 mr-1" />Featured</Badge>
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

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t('stats_completed'),    value: '50+', Icon: CheckCircle },
            { label: t('stats_experience'),   value: '6+',  Icon: CalendarIcon },
            { label: t('stats_clients'),      value: '35+', Icon: UsersIcon },
            { label: t('stats_technologies'), value: '25+', Icon: CodeIcon },
          ].map(({ label, value, Icon }) => (
            <Card key={label} className="text-center">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Icon />
                </div>
                <div className="text-3xl font-bold mb-2">{value}</div>
                <p className="text-sm text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckCircle() {
  return <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function CalendarIcon() {
  return <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function UsersIcon() {
  return <Users className="h-6 w-6 text-primary" />;
}
function CodeIcon() {
  return <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
}
