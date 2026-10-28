import {
  getSettings, listExperiences, listSkills, listPublicDocuments,
  type DocumentMeta,
} from '@lib/profile-db';
import { defaultLabel } from '@lib/cv-profiles';

export type Lang = 'fr' | 'en';

export interface AboutContent {
  intro1: string;
  intro2: string;
  learning: string;
  skills: { name: string; detail: string }[];
  work: { org: string; role: string; period: string; description: string }[];
  education: { org: string; role: string; period: string; description: string }[];
  cvs: { slug: string; label: string; formats: ('pdf' | 'docx')[] }[];
}

// Contenu de secours (mêmes faits vérifiés que seed-profile.sql) : le site ne casse pas
// si la migration n'a pas encore été appliquée ou si la base est indisponible.
const FALLBACK: Record<Lang, AboutContent> = {
  fr: {
    intro1: 'Élève-ingénieur en 5ᵉ année à l’ENSAM Meknès (Université Moulay Ismaïl), filière IATD-SI.',
    intro2: 'Je cherche un stage de fin d’études en IA / machine learning à partir de février 2027.',
    learning: 'Apprentissage rapide et continu : Julia, Rust, Unity / AR, apprentissage par renforcement et MLOps appris au fil de mes projets.',
    skills: [
      { name: 'Machine Learning / IA', detail: 'LightGBM, Isolation Forest, SVM, recommandation, apprentissage par renforcement' },
      { name: 'Développement full-stack', detail: 'Next.js, React, TypeScript, FastAPI, PostgreSQL' },
    ],
    work: [
      { org: 'DigiScia — Ouagadougou (Burkina Faso)', role: 'Stagiaire développeur full stack', period: '6 juillet – 6 septembre 2026', description: 'Projet SimpleOQuotidien ; ma part : le front-end, en Next.js.' },
      { org: 'Technocolabs Softwares — Indore (Inde), à distance', role: 'Stagiaire Data Scientist', period: '1er août – 20 octobre 2025 (2 mois)', description: 'Prédiction du devenir de startups ; ma part : arbres de décision et SVM.' },
    ],
    education: [
      { org: 'ENSAM Meknès — Université Moulay Ismaïl', role: 'Cycle ingénieur — filière IATD-SI', period: '2022 – 2027 (diplôme prévu en 2027)', description: '' },
    ],
    cvs: [],
  },
  en: {
    intro1: 'Fifth-year engineering student at ENSAM Meknès (Moulay Ismaïl University), IATD-SI track.',
    intro2: 'I am looking for a final-year internship in AI / machine learning from February 2027.',
    learning: 'Fast, continuous learner: Julia, Rust, Unity / AR, reinforcement learning and MLOps picked up through my projects.',
    skills: [
      { name: 'Machine Learning / AI', detail: 'LightGBM, Isolation Forest, SVM, recommendation, reinforcement learning' },
      { name: 'Full-stack development', detail: 'Next.js, React, TypeScript, FastAPI, PostgreSQL' },
    ],
    work: [
      { org: 'DigiScia — Ouagadougou (Burkina Faso)', role: 'Full-Stack Developer Intern', period: 'July 6 – September 6, 2026', description: 'SimpleOQuotidien project; my part: the front-end, in Next.js.' },
      { org: 'Technocolabs Softwares — Indore (India), remote', role: 'Data Scientist Intern', period: 'August 1 – October 20, 2025 (2 months)', description: 'Predicting startup outcomes; my part: decision trees and SVM.' },
    ],
    education: [
      { org: 'ENSAM Meknès — Moulay Ismaïl University', role: 'Engineering degree — IATD-SI track', period: '2022 – 2027 (degree expected 2027)', description: '' },
    ],
    cvs: [],
  },
};

function groupCvs(docs: DocumentMeta[], lang: Lang): AboutContent['cvs'] {
  const map = new Map<string, { slug: string; label: string; formats: ('pdf' | 'docx')[] }>();
  for (const d of docs) {
    const label = (lang === 'fr' ? d.label_fr : d.label_en) || defaultLabel(d.slug, lang);
    const g = map.get(d.slug) ?? { slug: d.slug, label, formats: [] };
    g.formats.push(d.format);
    map.set(d.slug, g);
  }
  return [...map.values()];
}

export async function getAboutContent(lang: Lang): Promise<AboutContent> {
  try {
    const [settings, skills, exps, docs] = await Promise.all([
      getSettings(), listSkills(), listExperiences(), listPublicDocuments(),
    ]);
    const pick = (o: { fr: string; en: string } | undefined, fb: string) => (o?.[lang] || o?.fr || fb);
    const fb = FALLBACK[lang];
    const map = (e: (typeof exps)[number]) => ({
      org: e.org,
      role: lang === 'fr' ? e.role_fr : e.role_en || e.role_fr,
      period: lang === 'fr' ? e.period_fr : e.period_en || e.period_fr,
      description: lang === 'fr' ? e.description_fr : e.description_en || e.description_fr,
    });
    return {
      intro1: pick(settings.about_intro_1, fb.intro1),
      intro2: pick(settings.about_intro_2, fb.intro2),
      learning: pick(settings.learning_line, fb.learning),
      skills: skills.length
        ? skills.map((s) => ({
            name: lang === 'fr' ? s.name_fr : s.name_en || s.name_fr,
            detail: lang === 'fr' ? s.detail_fr : s.detail_en || s.detail_fr,
          }))
        : fb.skills,
      work: exps.some((e) => e.kind === 'work') ? exps.filter((e) => e.kind === 'work').map(map) : fb.work,
      education: exps.some((e) => e.kind === 'education') ? exps.filter((e) => e.kind === 'education').map(map) : fb.education,
      cvs: groupCvs(docs, lang),
    };
  } catch (error) {
    console.error('getAboutContent fallback:', error);
    return FALLBACK[lang];
  }
}
