'use client';

import { useCallback, useEffect, useMemo, useState, FormEvent } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, Copy, Trash2, RotateCcw, Eye, EyeOff, Download, ExternalLink } from 'lucide-react';
import { CV_PROFILES } from '@lib/cv-profiles';

interface Doc {
  id: string;
  slug: string;
  format: 'pdf' | 'docx';
  label_fr: string;
  label_en: string;
  filename: string;
  size_bytes: number;
  version: number;
  is_current: boolean;
  is_public: boolean;
  download_count: number;
  created_at: string;
}

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} Ko`;
const fmtDate = (s: string) => new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AdminDocuments() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<string>(CV_PROFILES[0].key);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [customSlug, setCustomSlug] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/documents')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((d) => { if (!cancelled) setDocs(d); })
      .catch(() => { if (!cancelled) toast.error('Chargement impossible'); });
    return () => { cancelled = true; };
  }, [tick]);

  const slug = customSlug.trim().toLowerCase() || `${profile}-${lang}`;

  async function upload(e: FormEvent) {
    e.preventDefault();
    if (!file) return toast.error('Choisis un fichier PDF ou DOCX');
    setUploading(true);
    const fd = new FormData();
    fd.set('file', file);
    fd.set('slug', slug);
    fd.set('is_public', String(isPublic));
    const res = await fetch('/api/admin/documents', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) {
      const d = await res.json();
      toast.success(`Version ${d.version} en ligne : /cv/${d.slug}.${d.format}`);
      setFile(null);
      (document.getElementById('cv-file') as HTMLInputElement | null)?.setAttribute('value', '');
      load();
    } else {
      const err = await res.json().catch(() => ({ error: 'Erreur' }));
      toast.error(err.error ?? 'Échec du téléversement');
    }
  }

  async function copyLink(d: Doc) {
    const url = `${window.location.origin}/cv/${d.slug}.${d.format}`;
    try { await navigator.clipboard.writeText(url); toast.success('Lien copié'); } catch { toast.info(url); }
  }

  async function togglePublic(d: Doc) {
    const res = await fetch('/api/admin/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: d.slug, format: d.format, is_public: !d.is_public }),
    });
    if (res.ok) load(); else toast.error('Échec');
  }

  async function restore(d: Doc) {
    const res = await fetch(`/api/admin/documents/${d.id}`, { method: 'POST' });
    if (res.ok) { toast.success(`Version ${d.version} restaurée`); load(); } else toast.error('Échec');
  }

  async function remove(d: Doc) {
    if (!window.confirm(`Supprimer la version ${d.version} de ${d.slug}.${d.format} ?`)) return;
    const res = await fetch(`/api/admin/documents/${d.id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Supprimée'); load(); } else toast.error('Échec');
  }

  // Regroupe par (slug, format) ; la première ligne (version la plus haute) sert d'en-tête
  const groups = useMemo(() => {
    const map = new Map<string, Doc[]>();
    for (const d of docs ?? []) {
      const k = `${d.slug}.${d.format}`;
      map.set(k, [...(map.get(k) ?? []), d]);
    }
    return [...map.entries()];
  }, [docs]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Mes CV</h1>
        <p className="text-sm text-muted-foreground">
          Chaque CV a un lien stable (par exemple <code>/cv/ml-en.pdf</code>). Quand tu téléverses une nouvelle version,
          le lien reste le même : les recruteurs qui l’ont déjà reçu voient automatiquement la dernière version.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Téléverser un CV</CardTitle>
          <CardDescription>PDF ou DOCX, 5 Mo maximum. L’ancienne version est conservée et restaurable.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={upload} className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Profil</Label>
              <select className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" value={profile} onChange={(e) => setProfile(e.target.value)} disabled={!!customSlug.trim()}>
                {CV_PROFILES.map((p) => <option key={p.key} value={p.key}>{p.fr}</option>)}
              </select>
            </div>
            <div>
              <Label>Langue</Label>
              <select className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" value={lang} onChange={(e) => setLang(e.target.value as 'fr' | 'en')} disabled={!!customSlug.trim()}>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Ou identifiant personnalisé (optionnel)</Label>
              <Input placeholder="ex. mila-research-en" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
              <p className="mt-1 text-xs text-muted-foreground">Lien final : <code>/cv/{slug}.pdf</code> (ou .docx)</p>
            </div>
            <div className="md:col-span-2">
              <Label>Fichier</Label>
              <Input id="cv-file" type="file" accept=".pdf,.docx,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <label className="md:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Visible publiquement (lien actif et affiché sur la page « À propos »)
            </label>
            <div className="md:col-span-2">
              <Button type="submit" disabled={uploading}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Téléverser
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>CV en ligne</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {!docs && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          {docs && groups.length === 0 && <p className="text-sm text-muted-foreground">Aucun CV pour l’instant.</p>}
          {groups.map(([key, versions]) => {
            const current = versions.find((v) => v.is_current) ?? versions[0];
            return (
              <div key={key} className="rounded-md border p-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">/cv/{key}</p>
                    <p className="text-sm text-muted-foreground">
                      {current.label_fr} · v{current.version} · {kb(current.size_bytes)} · {fmtDate(current.created_at)}
                    </p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant={current.is_public ? 'default' : 'outline'}>{current.is_public ? 'Public' : 'Privé'}</Badge>
                      <Badge variant="outline"><Download className="mr-1 h-3 w-3" />{versions.reduce((a, v) => a + v.download_count, 0)}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => copyLink(current)}><Copy className="mr-1 h-4 w-4" />Copier le lien</Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/cv/${key}`} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-4 w-4" />Ouvrir</a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => togglePublic(current)} aria-label="Public / privé">
                      {current.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {versions.length > 1 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground">Historique ({versions.length} versions)</summary>
                    <ul className="mt-2 space-y-1">
                      {versions.map((v) => (
                        <li key={v.id} className="flex items-center justify-between gap-2 rounded border px-2 py-1">
                          <span>v{v.version} · {fmtDate(v.created_at)} · {kb(v.size_bytes)} {v.is_current && <Badge className="ml-1">courante</Badge>}</span>
                          <span className="flex gap-1">
                            {!v.is_current && <Button variant="ghost" size="sm" onClick={() => restore(v)}><RotateCcw className="mr-1 h-4 w-4" />Restaurer</Button>}
                            <Button variant="ghost" size="icon" onClick={() => remove(v)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {versions.length === 1 && (
                  <Button variant="ghost" size="sm" onClick={() => remove(current)}><Trash2 className="mr-1 h-4 w-4" />Supprimer</Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
