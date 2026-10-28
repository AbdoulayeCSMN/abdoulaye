import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Badge } from '@components/ui/badge';
import {
  User, Briefcase, Mail, Calendar, Target,
  Heart, Users, Clock, GraduationCap, Languages, FileText, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { getAboutContent, type Lang } from '@lib/about-content';

const T = {
  fr: {
    role: 'Élève-ingénieur IA & Technologies de Données', place: 'Meknès, Maroc',
    formation: 'Formation', formationVal: 'ENSAM Meknès, 5ᵉ année — diplôme 2027',
    availability: 'Disponibilité', availabilityVal: 'À partir de février 2027',
    contact: 'Me contacter', journey: 'Mon parcours', skills: 'Mes compétences',
    skillsDesc: 'Domaines et technologies utilisés dans mes projets', exp: 'Expérience professionnelle',
    edu: 'Formation', langs: 'Langues', cvTitle: 'Mes CV', cvDesc: 'Un CV par profil recherché, toujours à jour.',
    cvEmpty: 'Les CV seront bientôt disponibles.', philosophy: 'Ma philosophie',
    values: [
      { title: 'Impact avant tout', text: 'Je crée des solutions qui résolvent de vrais problèmes pour de vrais utilisateurs.' },
      { title: 'Collaboration transparente', text: 'Je crois en une communication ouverte et régulière avec mes encadrants et mes équipes.' },
      { title: 'Excellence continue', text: 'L’apprentissage et l’amélioration constante sont au cœur de mon approche.' },
    ],
  },
  en: {
    role: 'AI & Data Technologies engineering student', place: 'Meknès, Morocco',
    formation: 'Education', formationVal: 'ENSAM Meknès, 5th year — degree 2027',
    availability: 'Availability', availabilityVal: 'From February 2027',
    contact: 'Contact me', journey: 'My background', skills: 'Skills',
    skillsDesc: 'Areas and technologies used in my projects', exp: 'Professional experience',
    edu: 'Education', langs: 'Languages', cvTitle: 'My CVs', cvDesc: 'One CV per target profile, always up to date.',
    cvEmpty: 'CVs will be available soon.', philosophy: 'My approach',
    values: [
      { title: 'Impact first', text: 'I build solutions that solve real problems for real users.' },
      { title: 'Transparent collaboration', text: 'I believe in open, regular communication with my supervisors and teams.' },
      { title: 'Continuous improvement', text: 'Learning and constant improvement are at the heart of my approach.' },
    ],
  },
} as const;

const languages: Record<Lang, { name: string; level: string }[]> = {
  fr: [
    { name: 'Français', level: 'Courant, langue de travail' },
    { name: 'Anglais', level: 'Écrit courant, oral intermédiaire' },
    { name: 'Haoussa', level: 'Langue maternelle' },
    { name: 'Zarma', level: 'Langue maternelle' },
  ],
  en: [
    { name: 'French', level: 'Fluent, working language' },
    { name: 'English', level: 'Fluent written, intermediate spoken' },
    { name: 'Hausa', level: 'Native language' },
    { name: 'Zarma', level: 'Native language' },
  ],
};

const techStack = [
  'Python', 'Rust', 'C', 'C++', 'TypeScript', 'JavaScript', 'Java', 'R', 'Julia',
  'PyTorch', 'scikit-learn', 'pandas', 'NumPy',
  'FastAPI', 'Streamlit', 'Next.js', 'React', 'Node.js / Express',
  'PostgreSQL', 'TimescaleDB', 'Docker', 'Git', 'Linux',
];

function Timeline({ items }: { items: { org: string; role: string; period: string; description: string }[] }) {
  return (
    <div className="space-y-8">
      {items.map((it, index) => (
        <div key={`${it.org}-${index}`} className="relative pl-8">
          <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full" />
          {index < items.length - 1 && <div className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-primary/20" />}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-primary">{it.period}</span>
            </div>
            <h3 className="text-xl font-semibold">{it.role}</h3>
            <p className="text-primary">{it.org}</p>
            {it.description && <p className="text-muted-foreground">{it.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function About({ locale }: { locale: Lang }) {
  const t = T[locale];
  const c = await getAboutContent(locale);
  const icons = [Target, Users, Clock];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Sidebar card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 rounded-md overflow-hidden">
              <div className="relative h-48 flex items-center justify-center border-b border-border">
                <div className="w-28 h-28 rounded-full overflow-hidden border border-border flex items-center justify-center bg-secondary">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="path-label mb-2">~/about</p>
                  <h1 className="text-2xl font-semibold">Abdoulaye Chaibou Saidou</h1>
                  <p className="text-primary text-sm mt-1">{t.role}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.place}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t.formation}</p>
                      <p className="font-medium">{t.formationVal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t.availability}</p>
                      <p className="font-medium">{t.availabilityVal}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <Button asChild className="w-full rounded-sm">
                    <Link href={`/${locale}/contact`}>
                      <Mail className="mr-2 h-4 w-4" />
                      {t.contact}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-sm">
                    <a href="#cv"><FileText className="mr-2 h-4 w-4" />{t.cvTitle}</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  {t.journey}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">{c.intro1}</p>
                <p className="text-muted-foreground">{c.intro2}</p>
                {c.learning && (
                  <p className="flex items-start gap-2 rounded-sm border border-emerald-600/30 bg-emerald-600/10 p-3 font-medium text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{c.learning}</span>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  {t.skills}
                </CardTitle>
                <CardDescription>{t.skillsDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {c.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <span className="font-medium">{skill.name}</span>
                      <p className="text-sm text-muted-foreground">{skill.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="px-3 py-1">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  {t.exp}
                </CardTitle>
              </CardHeader>
              <CardContent><Timeline items={c.work} /></CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  {t.edu}
                </CardTitle>
              </CardHeader>
              <CardContent><Timeline items={c.education} /></CardContent>
            </Card>

            <Card id="cv" className="rounded-md scroll-mt-24">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  {t.cvTitle}
                </CardTitle>
                <CardDescription>{t.cvDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                {c.cvs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t.cvEmpty}</p>
                ) : (
                  <ul className="space-y-3">
                    {c.cvs.map((cv) => (
                      <li key={cv.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border p-3">
                        <span className="font-medium">{cv.label}</span>
                        <span className="flex gap-2">
                          {cv.formats.map((f) => (
                            <Button key={f} asChild size="sm" variant={f === 'pdf' ? 'default' : 'outline'} className="rounded-sm">
                              <a href={`/cv/${cv.slug}.${f}`} {...(f === 'pdf' ? { target: '_blank', rel: 'noreferrer' } : {})}>
                                {f.toUpperCase()}
                              </a>
                            </Button>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Languages className="h-6 w-6 text-primary" />
                  {t.langs}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {languages[locale].map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between p-3 rounded-sm border">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-muted-foreground">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  {t.philosophy}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {t.values.map((item, i) => {
                    const Icon = icons[i];
                    return (
                      <div key={item.title} className="p-6 border border-border rounded-sm">
                        <div className="mb-4"><Icon className="h-8 w-8 text-primary" /></div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
