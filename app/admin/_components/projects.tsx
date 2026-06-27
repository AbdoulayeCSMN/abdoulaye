'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Loader2, Pencil, Trash2, Eye, EyeOff, Plus, X, Star, StarOff,
} from 'lucide-react';

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
  is_published: boolean;
  year?: string;
  status?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ['frontend', 'backend', 'fullstack', 'mobile', 'design', 'other'];
const STATUSES = ['live', 'completed', 'in_progress'];

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  category: 'fullstack',
  technologies: '',
  github_url: '',
  live_url: '',
  cover_image: '',
  year: String(new Date().getFullYear()),
  status: 'completed',
  is_featured: false,
  is_published: false,
  sort_order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description ?? '',
      category: p.category ?? 'fullstack',
      technologies: (p.technologies ?? []).join(', '),
      github_url: p.github_url ?? '',
      live_url: p.live_url ?? '',
      cover_image: p.cover_image ?? '',
      year: p.year ?? String(new Date().getFullYear()),
      status: p.status ?? 'completed',
      is_featured: p.is_featured,
      is_published: p.is_published,
      sort_order: p.sort_order,
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  function handleChange(field: string, value: string | boolean | number) {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      // Auto-generate slug from title if creating
      if (field === 'title' && !editingId) {
        updated.slug = (value as string)
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
      return updated;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(editingId ? 'Projet mis à jour' : 'Projet créé');
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Projet supprimé');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error('Erreur lors de la suppression');
    }
    setDeleteId(null);
  }

  async function togglePublish(p: Project) {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !p.is_published }),
    });
    if (res.ok) {
      toast.success(p.is_published ? 'Projet dépublié' : 'Projet publié');
      fetchProjects();
    }
  }

  async function toggleFeatured(p: Project) {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !p.is_featured }),
    });
    if (res.ok) fetchProjects();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projets</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} projet{projects.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter un projet
        </Button>
      </div>

      {/* Form panel */}
      {showForm && (
        <Card className="mb-8 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>{editingId ? 'Modifier le projet' : 'Nouveau projet'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input id="title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies (séparées par virgule)</Label>
                  <Input id="technologies" placeholder="Next.js, TypeScript, PostgreSQL" value={form.technologies} onChange={(e) => handleChange('technologies', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input id="year" placeholder="2024" value={form.year} onChange={(e) => handleChange('year', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">URL GitHub</Label>
                  <Input id="github_url" type="url" placeholder="https://github.com/..." value={form.github_url} onChange={(e) => handleChange('github_url', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="live_url">URL Live</Label>
                  <Input id="live_url" type="url" placeholder="https://..." value={form.live_url} onChange={(e) => handleChange('live_url', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cover_image">URL de l&apos;image de couverture</Label>
                  <Input id="cover_image" type="url" placeholder="https://..." value={form.cover_image} onChange={(e) => handleChange('cover_image', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Ordre d&apos;affichage</Label>
                  <Input id="sort_order" type="number" value={form.sort_order} onChange={(e) => handleChange('sort_order', Number(e.target.value))} />
                </div>
                <div className="flex items-end gap-6 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => handleChange('is_published', e.target.checked)} className="h-4 w-4 rounded" />
                    <span className="text-sm font-medium">Publié</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => handleChange('is_featured', e.target.checked)} className="h-4 w-4 rounded" />
                    <span className="text-sm font-medium">En vedette</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Enregistrer' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-xl">
          <p className="text-lg font-medium text-muted-foreground">Aucun projet</p>
          <p className="text-sm text-muted-foreground mt-1">Cliquez sur « Ajouter un projet » pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                {/* Color bar */}
                <div className="hidden sm:block w-1.5 h-12 rounded-full bg-primary/40 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold truncate">{p.title}</span>
                    {p.is_featured && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                    <Badge variant={p.is_published ? 'default' : 'secondary'} className="text-xs">
                      {p.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                    {p.category && <Badge variant="outline" className="text-xs">{p.category}</Badge>}
                    {p.status && <Badge variant="outline" className="text-xs">{p.status}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{p.description}</p>
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {p.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs bg-muted px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                      {p.technologies.length > 4 && <span className="text-xs text-muted-foreground">+{p.technologies.length - 4}</span>}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleFeatured(p)} title={p.is_featured ? 'Retirer de la vedette' : 'Mettre en vedette'}>
                    {p.is_featured ? <StarOff className="h-4 w-4 text-yellow-500" /> : <Star className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => togglePublish(p)} title={p.is_published ? 'Dépublier' : 'Publier'}>
                    {p.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Modifier">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)} title="Supprimer" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteId && handleDelete(deleteId)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
