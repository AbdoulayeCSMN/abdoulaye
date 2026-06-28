import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Badge } from '@components/ui/badge';
import {
  User, Briefcase, Mail, Calendar,
  Code, Palette, Server, Globe, Target,
  Heart, Trophy, Users, Clock, GraduationCap, Languages,
} from 'lucide-react';
import Link from 'next/link';

const skills = [
  { name: 'React / Next.js',          level: 95, icon: <Code    className="h-4 w-4" /> },
  { name: 'TypeScript',               level: 90, icon: <Code    className="h-4 w-4" /> },
  { name: 'UI / UX Design',           level: 85, icon: <Palette className="h-4 w-4" /> },
  { name: 'Backend Development',      level: 80, icon: <Server  className="h-4 w-4" /> },
  { name: 'DevOps & CI/CD',           level: 75, icon: <Globe   className="h-4 w-4" /> },
  { name: 'Product Strategy',         level: 85, icon: <Target  className="h-4 w-4" /> },
];

// Professional experience
const experiences: { year: string; role: string; company: string; description: string }[] = [
  {
    year: '3 mois',
    role: 'Stagiaire — Data Science / Machine Learning',
    company: 'Technocolabs (startup, Inde) — à distance',
    description: "Prédiction de la faillite d'entreprises : développement de modèles de classification multiclasse du risque (SVM et Random Forest) à partir du jeu de données « companies », incluant préparation des données et entraînement des modèles.",
  },
];

const education: { year: string; degree: string; school: string; description: string }[] = [
  {
    year: '4ᵉ année (2ᵉ année cycle ingénieur)',
    degree: 'Cycle ingénieur — filière IATD-SI',
    school: 'ENSAM Meknès — Université Moulay Ismaïl',
    description: "Intelligence Artificielle et Technologies de Données — Sciences de l'Ingénieur. Bagage antérieur en génie mécanique et dessin technique (niveau diplôme).",
  },
];

const languages = [
  { name: 'Français', level: 'Courant, langue de travail' },
  { name: 'Anglais', level: 'Très bon à l’écrit, intermédiaire à l’oral' },
  { name: 'Haoussa', level: 'Langue maternelle' },
  { name: 'Zarma', level: 'Langue maternelle' },
];

const techStack = [
  'Python', 'Rust', 'C', 'C++', 'TypeScript', 'JavaScript', 'Java', 'R', 'Julia',
  'PyTorch', 'scikit-learn', 'pandas', 'NumPy',
  'FastAPI', 'Streamlit', 'Next.js', 'React', 'Node.js / Express',
  'PostgreSQL', 'TimescaleDB', 'Docker', 'Git', 'Linux',
];

export default function About() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Sidebar card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2 overflow-hidden">
              <div className="relative h-64 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-linear-to-br from-primary to-primary/50 flex items-center justify-center">
                  {/* ✏️ Replace with <Image src="/photo.jpg" … /> */}
                  <User className="h-24 w-24 text-white" />
                </div>
              </div>

              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold">Abdoulaye</h1>
                  <p className="text-primary font-medium mt-2">Élève-ingénieur IA & Technologies de Données</p>
                  <p className="text-sm text-muted-foreground mt-1">Meknès, Maroc</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expérience</p>
                      <p className="font-medium">4+ années</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Projets complétés</p>
                      <p className="font-medium">18+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                      <p className="font-medium">4+</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <Button asChild className="w-full">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Me contacter
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Introduction */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Mon parcours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  Élève-ingénieur en 4ᵉ année à l&apos;ENSAM Meknès (Université Moulay Ismaïl), filière
                  Intelligence Artificielle et Technologies de Données — Sciences de l&apos;Ingénieur.
                </p>
                <p className="text-muted-foreground">
                  Je conçois et développe des projets concrets, du machine learning et de l&apos;analyse de
                  données aux systèmes bas niveau (conception d&apos;un langage de programmation et de son
                  gestionnaire de paquets), en passant par les plateformes SaaS et la réalité augmentée.
                  Je recherche actuellement un stage en IA, science des données ou développement logiciel.
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Mes compétences
                </CardTitle>
                <CardDescription>Technologies et domaines d&apos;expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {skill.icon}
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Stack technique</h4>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="px-3 py-1">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Expérience professionnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {experiences.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">
                    ✏️ Ajoutez votre expérience dans <code>app/src/components/About.tsx</code>
                  </p>
                ) : (
                  <div className="space-y-8">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative pl-8">
                        <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full" />
                        {index < experiences.length - 1 && (
                          <div className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-primary/20" />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-primary">{exp.year}</span>
                          </div>
                          <h3 className="text-xl font-semibold">{exp.role}</h3>
                          <p className="text-primary">{exp.company}</p>
                          <p className="text-muted-foreground">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formation */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {education.map((edu, index) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full" />
                      {index < education.length - 1 && (
                        <div className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-primary/20" />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-primary">{edu.year}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{edu.degree}</h3>
                        <p className="text-primary">{edu.school}</p>
                        <p className="text-muted-foreground">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Langues */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Languages className="h-6 w-6 text-primary" />
                  Langues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {languages.map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-muted-foreground">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="border-2 bg-linear-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  Ma philosophie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: <Target className="h-8 w-8 text-primary" />, title: 'Impact avant tout', text: 'Je crée des solutions qui résolvent de vrais problèmes pour de vrais utilisateurs.' },
                    { icon: <Users className="h-8 w-8 text-primary" />, title: 'Collaboration transparente', text: 'Je crois en une communication ouverte et régulière avec chaque client.' },
                    { icon: <Clock className="h-8 w-8 text-primary" />, title: 'Excellence continue', text: "L'apprentissage et l'amélioration constante sont au cœur de mon approche." },
                  ].map((item) => (
                    <div key={item.title} className="text-center p-6 bg-background rounded-lg border">
                      <div className="flex justify-center mb-4">{item.icon}</div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
