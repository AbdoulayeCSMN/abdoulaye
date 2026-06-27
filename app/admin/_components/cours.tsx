'use client';

import { useState, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@components/ui/tabs';
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
import { Loader2, Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  cover_image?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState({ courses: true, notes: false, action: false });

  const [courseForm, setCourseForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    cover_image: '',
  });

  const [noteForm, setNoteForm] = useState({
    course_slug: '',
    title: '',
    slug: '',
    content: '',
    order_index: 0,
  });

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteCourseSlug, setDeleteCourseSlug] = useState<string | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    if (selectedCourse) fetchNotes(selectedCourse.slug);
    else setNotes([]);
  }, [selectedCourse]);

  // FIX : utilise /api/admin/courses pour récupérer TOUS les cours (publiés ou non)
  const fetchCourses = async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const res = await fetch('/api/admin/courses');
      if (!res.ok) throw new Error('Erreur chargement cours');
      setCourses(await res.json());
    } catch (error) {
      toast.error('Impossible de charger les cours');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const fetchNotes = async (courseSlug: string) => {
    setLoading(prev => ({ ...prev, notes: true }));
    try {
      const res = await fetch(`/api/notes?course_slug=${courseSlug}`);
      if (!res.ok) throw new Error('Erreur chargement notes');
      setNotes(await res.json());
    } catch (error) {
      toast.error('Impossible de charger les notes');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, notes: false }));
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseForm, is_published: true }),
      });
      if (!res.ok) throw new Error('Erreur création');
      toast.success('Cours créé avec succès');
      setCourseForm({ title: '', slug: '', description: '', category: '', cover_image: '' });
      fetchCourses();
    } catch (error) {
      toast.error('Échec de la création du cours');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

    const handleUpdateCourse = async (course: Course) => {
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const res = await fetch(`/api/courses/${course.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      toast.success('Cours mis à jour');
      setEditingCourse(null);
      fetchCourses();
      if (selectedCourse?.id === course.id) setSelectedCourse(course);
    } catch (error) {
      toast.error('Échec de la mise à jour');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteCourse = async (slug: string) => {
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const res = await fetch(`/api/courses/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      toast.success('Cours supprimé');
      setDeleteCourseSlug(null);
      if (selectedCourse?.slug === slug) setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      toast.error('Échec de la suppression');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...noteForm, is_published: true }),
      });
      if (!res.ok) throw new Error('Erreur création note');
      toast.success('Note créée');
      setNoteForm({ course_slug: '', title: '', slug: '', content: '', order_index: 0 });
      if (selectedCourse) fetchNotes(selectedCourse.slug);
    } catch (error) {
      toast.error('Échec de la création de la note');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleUpdateNote = async (note: Note) => {
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error('Erreur mise à jour note');
      toast.success('Note mise à jour');
      setEditingNote(null);
      if (selectedCourse) fetchNotes(selectedCourse.slug);
    } catch (error) {
      toast.error('Échec de la mise à jour');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteNote = async (id: string) => {
    setLoading(prev => ({ ...prev, action: true }));
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression note');
      toast.success('Note supprimée');
      setDeleteNoteId(null);
      if (selectedCourse) fetchNotes(selectedCourse.slug);
    } catch (error) {
      toast.error('Échec de la suppression');
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const toggleCoursePublished = (course: Course) =>
    handleUpdateCourse({ ...course, is_published: !course.is_published });

  const toggleNotePublished = (note: Note) =>
    handleUpdateNote({ ...note, is_published: !note.is_published });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Administration des Cours</h1>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create">Créer</TabsTrigger>
          <TabsTrigger value="manage">Gérer</TabsTrigger>
        </TabsList>

        {/* ── Onglet Création ── */}
        <TabsContent value="create" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Créer un cours */}
            <Card>
              <CardHeader>
                <CardTitle>Créer un nouveau cours</CardTitle>
                <CardDescription>Ajoutez un nouveau cours à votre portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={courseForm.title}
                      onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={courseForm.slug}
                      onChange={e => setCourseForm({ ...courseForm, slug: e.target.value })}
                      placeholder="mon-cours-react"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseForm.description}
                      onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={courseForm.category}
                      onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                      placeholder="React, Node.js, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="cover_image">URL de l'image</Label>
                    <Input
                      id="cover_image"
                      value={courseForm.cover_image}
                      onChange={e => setCourseForm({ ...courseForm, cover_image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading.action}>
                    {loading.action
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <Plus className="mr-2 h-4 w-4" />}
                    Créer le cours
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Créer une note */}
            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle note</CardTitle>
                <CardDescription>Ajoutez une leçon à un cours existant</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <div>
                    <Label htmlFor="course_slug">Slug du cours</Label>
                    <Input
                      id="course_slug"
                      value={noteForm.course_slug}
                      onChange={e => setNoteForm({ ...noteForm, course_slug: e.target.value })}
                      placeholder="mon-cours-react"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="note_title">Titre de la note</Label>
                    <Input
                      id="note_title"
                      value={noteForm.title}
                      onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="note_slug">Slug de la note</Label>
                    <Input
                      id="note_slug"
                      value={noteForm.slug}
                      onChange={e => setNoteForm({ ...noteForm, slug: e.target.value })}
                      placeholder="introduction"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="order_index">Ordre (0, 1, 2…)</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={noteForm.order_index}
                      onChange={e => setNoteForm({ ...noteForm, order_index: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Contenu MDX</Label>
                    <Textarea
                      id="content"
                      value={noteForm.content}
                      onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                      rows={10}
                      placeholder={"# Introduction\n\nVotre contenu en **MDX**..."}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading.action}>
                    {loading.action
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <Plus className="mr-2 h-4 w-4" />}
                    Créer la note
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Onglet Gestion ── */}
        <TabsContent value="manage">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Liste des cours */}
            <Card>
              <CardHeader>
                <CardTitle>Cours existants</CardTitle>
                <CardDescription>
                  {loading.courses ? 'Chargement…' : `${courses.length} cours trouvés`}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {loading.courses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : courses.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Aucun cours pour le moment</p>
                ) : (
                  <div className="space-y-4">
                    {courses.map(course => (
                      <div
                        key={course.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          selectedCourse?.id === course.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-muted-foreground/20'
                        }`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{course.title}</h3>
                              {!course.is_published && (
                                <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                  Brouillon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">Slug : {course.slug}</p>
                            {course.category && (
                              <span className="mt-1 inline-block rounded bg-secondary px-2 py-1 text-xs">
                                {course.category}
                              </span>
                            )}
                          </div>
                          <div className="ml-4 flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={e => { e.stopPropagation(); setEditingCourse(course); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={e => { e.stopPropagation(); toggleCoursePublished(course); }}
                              title={course.is_published ? 'Dépublier' : 'Publier'}
                            >
                              {course.is_published
                                ? <Eye className="h-4 w-4" />
                                : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={e => { e.stopPropagation(); setDeleteCourseSlug(course.slug); }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes du cours sélectionné */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCourse ? `Notes de "${selectedCourse.title}"` : 'Sélectionnez un cours'}
                </CardTitle>
                <CardDescription>
                  {selectedCourse
                    ? loading.notes ? 'Chargement…' : `${notes.length} note(s)`
                    : 'Cliquez sur un cours pour voir ses notes'}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {!selectedCourse ? (
                  <p className="py-8 text-center text-muted-foreground">Aucun cours sélectionné</p>
                ) : loading.notes ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : notes.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Aucune note pour ce cours</p>
                ) : (
                  <div className="space-y-4">
                    {notes.map(note => (
                      <div key={note.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{note.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Ordre : {note.order_index} | Slug : {note.slug}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingNote(note)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleNotePublished(note)}>
                              {note.is_published
                                ? <Eye className="h-4 w-4" />
                                : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteNoteId(note.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm">
                          {note.content.replace(/[#*`]/g, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Édition cours ── */}
      {editingCourse && (
        <AlertDialog open onOpenChange={() => setEditingCourse(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Modifier le cours</AlertDialogTitle>
              <AlertDialogDescription>
                Modifiez les informations du cours puis enregistrez.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form
              onSubmit={e => { e.preventDefault(); handleUpdateCourse(editingCourse); }}
              className="space-y-4"
            >
              <div>
                <Label>Titre</Label>
                <Input
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editingCourse.slug}
                  onChange={e => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingCourse.description ?? ''}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Input
                  value={editingCourse.category ?? ''}
                  onChange={e => setEditingCourse({ ...editingCourse, category: e.target.value })}
                />
              </div>
              <div>
                <Label>URL de l'image</Label>
                <Input
                  value={editingCourse.cover_image ?? ''}
                  onChange={e => setEditingCourse({ ...editingCourse, cover_image: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCourse(null)}
                  disabled={loading.action}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading.action}>
                  {loading.action && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* ── Édition note ── */}
      {editingNote && (
      <AlertDialog open onOpenChange={() => setEditingNote(null)}
          >
          <AlertDialogContent className="fixed
                  left-1/2
                  top-1/2
                  w-[95vw]
                  max-w-2xl
                  max-h-[90vh]
                  overflow-y-auto
                  -translate-x-1/2
                  -translate-y-1/2">
            <AlertDialogHeader>
              <AlertDialogTitle>Modifier la note</AlertDialogTitle>
            </AlertDialogHeader>
            <form
              onSubmit={e => { e.preventDefault(); handleUpdateNote(editingNote); }}
              className="space-y-4"
            >
              <div>
                <Label>Titre</Label>
                <Input
                  value={editingNote.title}
                  onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editingNote.slug}
                  onChange={e => setEditingNote({ ...editingNote, slug: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Ordre</Label>
                <Input
                  type="number"
                  value={editingNote.order_index}
                  onChange={e => setEditingNote({ ...editingNote, order_index: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label>Contenu MDX</Label>
                <Textarea
                  value={editingNote.content}
                  onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingNote(null)}
                disabled={loading.action}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading.action}>
                  {loading.action && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* ── Confirmation suppression cours ── */}
      <AlertDialog open={!!deleteCourseSlug} onOpenChange={() => setDeleteCourseSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les notes associées seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCourseSlug && handleDeleteCourse(deleteCourseSlug)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Confirmation suppression note ── */}
      <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la note ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteNoteId && handleDeleteNote(deleteNoteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}