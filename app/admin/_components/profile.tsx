'use client';

import { useCallback, useEffect, useState, FormEvent } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

// ─── Réglages (textes FR / EN) ────────────────────────────────────────────────

const SETTINGS_FIELDS: { key: string; label: string; rows: number }[] = [
  { key: 'about_intro_1', label: 'Présentation — 1er paragraphe', rows: 3 },
  { key: 'about_intro_2', label: 'Présentation — 2ᵉ paragraphe', rows: 5 },
  { key: 'learning_line', label: 'Ligne « apprentissage »', rows: 2 },
];

type Settings = Record<string, { fr: string; en: string }>;

function SettingsEditor() {
  const [values, setValues] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(setValues)
      .catch(() => toast.error('Chargement impossible'));
  }, []);

  function set(key: string, lang: 'fr' | 'en', v: string) {
    setValues((prev) => ({ ...(prev ?? {}), [key]: { fr: '', en: '', ...(prev?.[key] ?? {}), [lang]: v } }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) toast.success('Textes enregistrés');
    else toast.error('Échec de l’enregistrement');
  }

  if (!values) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <form onSubmit={save} className="space-y-6">
      {SETTINGS_FIELDS.map((f) => (
        <div key={f.key} className="space-y-2">
          <Label className="font-semibold">{f.label}</Label>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-muted-foreground">Français</span>
              <Textarea rows={f.rows} value={values[f.key]?.fr ?? ''} onChange={(e) => set(f.key, 'fr', e.target.value)} />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">English</span>
              <Textarea rows={f.rows} value={values[f.key]?.en ?? ''} onChange={(e) => set(f.key, 'en', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <Button type="submit" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer les textes
      </Button>
    </form>
  );
}

// ─── Éditeur de liste générique (expériences, compétences) ────────────────────

type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  options?: { value: string; label: string }[];
  half?: boolean;
};

type Item = Record<string, string | number | boolean>;

function ItemsEditor({
  endpoint,
  fields,
  empty,
  title,
  subtitle,
}: {
  endpoint: string;
  fields: Field[];
  empty: Item;
  title: (i: Item) => string;
  subtitle: (i: Item) => string;
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);

  const [tick, setTick] = useState(0);
  const load = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((d) => { if (!cancelled) setItems(d); })
      .catch(() => { if (!cancelled) toast.error('Chargement impossible'); });
    return () => { cancelled = true; };
  }, [endpoint, tick]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch(isNew ? endpoint : `${endpoint}/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) {
      toast.success('Enregistré');
      setEditing(null);
      load();
    } else toast.error('Échec : vérifie les champs obligatoires');
  }

  async function remove(item: Item) {
    if (!window.confirm(`Supprimer « ${title(item)} » ?`)) return;
    const res = await fetch(`${endpoint}/${item.id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Supprimé'); load(); } else toast.error('Échec de la suppression');
  }

  async function toggle(item: Item) {
    const res = await fetch(`${endpoint}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_published: !item.is_published }),
    });
    if (res.ok) load();
  }

  if (!items) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={String(item.id)} className="flex items-start justify-between gap-4 rounded-md border p-3">
          <div className="min-w-0">
            <p className="font-medium">{title(item)}</p>
            <p className="text-sm text-muted-foreground">{subtitle(item)}</p>
            {!item.is_published && <Badge variant="outline" className="mt-1">Masqué</Badge>}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" onClick={() => toggle(item)} aria-label="Afficher ou masquer">
              {item.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setEditing(item)} aria-label="Modifier"><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => remove(item)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}

      {editing ? (
        <form onSubmit={save} className="space-y-4 rounded-md border bg-muted/30 p-4">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.type === 'textarea' || !f.half ? 'md:col-span-2' : ''}>
                <Label className="text-sm">{f.label}</Label>
                {f.type === 'textarea' ? (
                  <Textarea rows={4} value={String(editing[f.name] ?? '')} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })} />
                ) : f.type === 'select' ? (
                  <select
                    className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={String(editing[f.name] ?? '')}
                    onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                  >
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <Input
                    type={f.type}
                    value={String(editing[f.name] ?? '')}
                    onChange={(e) => setEditing({ ...editing, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setEditing({ ...empty })}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProfile() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Profil du site</h1>
        <p className="text-sm text-muted-foreground">
          Tout ce qui s’affiche sur la page « À propos », en français et en anglais. Les modifications sont visibles tout de suite.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Textes de présentation</CardTitle></CardHeader>
        <CardContent><SettingsEditor /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expérience et formation</CardTitle>
          <CardDescription>L’ordre d’affichage suit le champ « Ordre » (le plus petit en premier).</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemsEditor
            endpoint="/api/admin/experiences"
            empty={{ kind: 'work', org: '', role_fr: '', role_en: '', period_fr: '', period_en: '', description_fr: '', description_en: '', sort_order: 0, is_published: true }}
            title={(i) => `${i.role_fr} — ${i.org}`}
            subtitle={(i) => `${i.kind === 'education' ? 'Formation' : 'Expérience'} · ${i.period_fr}`}
            fields={[
              { name: 'kind', label: 'Type', type: 'select', half: true, options: [{ value: 'work', label: 'Expérience' }, { value: 'education', label: 'Formation' }] },
              { name: 'sort_order', label: 'Ordre', type: 'number', half: true },
              { name: 'org', label: 'Organisation', type: 'text' },
              { name: 'role_fr', label: 'Intitulé (FR)', type: 'text', half: true },
              { name: 'role_en', label: 'Title (EN)', type: 'text', half: true },
              { name: 'period_fr', label: 'Période (FR)', type: 'text', half: true },
              { name: 'period_en', label: 'Period (EN)', type: 'text', half: true },
              { name: 'description_fr', label: 'Description (FR)', type: 'textarea' },
              { name: 'description_en', label: 'Description (EN)', type: 'textarea' },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Domaines de compétences</CardTitle></CardHeader>
        <CardContent>
          <ItemsEditor
            endpoint="/api/admin/skills"
            empty={{ name_fr: '', name_en: '', detail_fr: '', detail_en: '', sort_order: 0, is_published: true }}
            title={(i) => String(i.name_fr)}
            subtitle={(i) => String(i.detail_fr)}
            fields={[
              { name: 'name_fr', label: 'Domaine (FR)', type: 'text', half: true },
              { name: 'name_en', label: 'Domain (EN)', type: 'text', half: true },
              { name: 'sort_order', label: 'Ordre', type: 'number', half: true },
              { name: 'detail_fr', label: 'Technologies (FR)', type: 'textarea' },
              { name: 'detail_en', label: 'Technologies (EN)', type: 'textarea' },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
