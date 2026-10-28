// Profils de CV proposés dans l'admin. Le slug public d'un CV est « <profil>-<langue> »,
// par exemple « ml-en » → lien stable /cv/ml-en.pdf.
export const CV_PROFILES = [
  { key: 'ml',       fr: 'AI / Machine Learning',            en: 'AI / Machine Learning' },
  { key: 'mlops',    fr: 'MLOps / ML Engineering',           en: 'MLOps / ML Engineering' },
  { key: 'research', fr: 'Recherche en IA / R&D',            en: 'AI Research / R&D' },
  { key: 'data',     fr: 'Data Science / IA appliquée',      en: 'Data Science / Applied AI' },
  { key: 'vision3d', fr: '3D / Vision / Jumeaux numériques', en: '3D / Vision / Digital Twins' },
] as const;

export const CV_LANGS = ['fr', 'en'] as const;
export type CvLang = (typeof CV_LANGS)[number];

export const MAX_DOC_BYTES = 5 * 1024 * 1024; // 5 Mo

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,39}$/;

export function defaultLabel(slug: string, lang: 'fr' | 'en'): string {
  const [profile, l] = [slug.replace(/-(fr|en)$/, ''), slug.endsWith('-en') ? 'en' : slug.endsWith('-fr') ? 'fr' : null];
  const p = CV_PROFILES.find((x) => x.key === profile);
  const name = p ? p[lang] : slug;
  const suffix = l ? ` (${l.toUpperCase()})` : '';
  return `${name}${suffix}`;
}
