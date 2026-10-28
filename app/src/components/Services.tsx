import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import {
  Code,
  Palette,
  Server,
  Smartphone,
  Search,
  Zap,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Shield,
  BarChart,
  Target,
  Brain,
} from "lucide-react"

const services = [
  {
    id: 1,
    title: "IA & Data Science",
    description: "Machine learning, modélisation prédictive et analyse de données pour transformer vos données en décisions concrètes.",
    icon: <Brain className="h-8 w-8" />,
    features: [
      "Modèles de classification & régression (scikit-learn, PyTorch)",
      "Détection d'anomalies et maintenance prédictive",
      "Agents conversationnels & NLP",
      "Pipelines de données (pandas, NumPy)",
      "Architectures API pour servir des modèles (FastAPI)"
    ],
    price: "Sur devis",
    popular: true,
  },
  {
    id: 2,
    title: "Développement Web",
    description: "Sites vitrines, applications web complexes et solutions sur mesure avec les dernières technologies.",
    icon: <Code className="h-8 w-8" />,
    features: [
      "Applications React/Next.js performantes",
      "Progressive Web Apps (PWA)",
      "Optimisation SEO intégrée",
      "Responsive design mobile-first",
      "Tests automatisés"
    ],
    price: "Sur devis",
    popular: false,
  },
  {
    id: 3,
    title: "Design UI/UX",
    description: "Interfaces intuitives et esthétiques qui captivent vos utilisateurs et améliorent l'engagement.",
    icon: <Palette className="h-8 w-8" />,
    features: [
      "Design system complet",
      "Prototypes interactifs",
      "Tests utilisateurs",
      "Design responsive",
      "Accessibilité WCAG"
    ],
    price: "Sur devis",
    popular: false,
  },
  {
    id: 4,
    title: "Développement Backend",
    description: "APIs robustes, bases de données optimisées et architectures cloud scalables.",
    icon: <Server className="h-8 w-8" />,
    features: [
      "APIs REST/GraphQL",
      "Bases de données SQL/NoSQL",
      "Microservices architecture",
      "Conteneurisation Docker",
      "Monitoring & logging"
    ],
    price: "Sur devis",
    popular: false,
  },
  {
    id: 5,
    title: "Applications Mobile",
    description: "Applications iOS et Android natives ou cross-platform pour toucher votre audience mobile.",
    icon: <Smartphone className="h-8 w-8" />,
    features: [
      "React Native cross-platform",
      "Applications natives iOS/Android",
      "Intégration d'APIs",
      "Notifications push",
      "Stores d'applications"
    ],
    price: "Sur devis",
    popular: false,
  },
  {
    id: 6,
    title: "SEO & Performance",
    description: "Optimisation technique et stratégique pour améliorer votre visibilité et vos performances.",
    icon: <Search className="h-8 w-8" />,
    features: [
      "Audit SEO complet",
      "Optimisation Core Web Vitals",
      "Stratégie de contenu",
      "Analytics & reporting",
      "Technical SEO"
    ],
    price: "Sur devis",
    popular: false,
  },
  {
    id: 7,
    title: "Consulting Tech",
    description: "Accompagnement stratégique pour vos projets digitaux et transformation technologique.",
    icon: <Users className="h-8 w-8" />,
    features: [
      "Architecture technique",
      "Revue de code",
      "Formation d'équipe",
      "Roadmap produit",
      "Mentorat technique"
    ],
    price: "Sur devis",
    popular: false,
  },
]

const processSteps = [
  {
    step: "01",
    title: "Découverte",
    description: "Analyse de vos besoins et objectifs business",
    icon: <Target className="h-5 w-5" />,
  },
  {
    step: "02",
    title: "Conception",
    description: "Wireframes, maquettes et architecture technique",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    step: "03",
    title: "Développement",
    description: "Implémentation avec revues de code régulières",
    icon: <Code className="h-5 w-5" />,
  },
  {
    step: "04",
    title: "Tests & Lancement",
    description: "Tests approfondis et déploiement en production",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    step: "05",
    title: "Maintenance",
    description: "Support continu et améliorations",
    icon: <Shield className="h-5 w-5" />,
  },
]

export default function Services() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 max-w-2xl">
          <p className="path-label mb-3">~/services</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Solutions digitales sur mesure
          </h1>
          <p className="text-lg text-muted-foreground">
            Des services complets pour transformer vos idées en produits digitaux performants 
            et innovants.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`group rounded-md hover:border-primary/60 transition-colors duration-200 relative ${
                service.popular ? "border-primary" : "border-border"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground rounded-sm">
                    Populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm border border-border mb-4 text-primary">
                  {service.icon}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <div className="text-xl font-mono-tight">{service.price}</div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full rounded-sm">
                  Discuter du projet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Processus */}
        <div className="mb-16 max-w-3xl">
          <p className="path-label mb-3">~/services/process</p>
          <h2 className="text-2xl font-semibold tracking-tight mb-10">Processus de travail</h2>

          <div className="border-t border-border">
            {processSteps.map((step) => (
              <div key={step.step} className="flex gap-6 py-6 border-b border-border">
                <span className="font-mono-tight text-sm text-muted-foreground w-6 pt-0.5">{step.step}</span>
                <div className="text-primary pt-0.5">{step.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs pour les détails supplémentaires */}
        <Tabs defaultValue="methodology" className="mb-16">
          <TabsList className="grid grid-cols-3 mb-8 rounded-sm">
            <TabsTrigger value="methodology">Méthodologie</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="methodology">
            <Card>
              <CardHeader>
                <CardTitle>Approche Méthodologique</CardTitle>
                <CardDescription>
                  Une combinaison agile des meilleures pratiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border border-border rounded-sm">
                    <Users className="h-5 w-5 text-primary mb-4" />
                    <h4 className="font-semibold mb-2">Collaboration</h4>
                    <p className="text-sm text-muted-foreground">
                      Communication transparente et revues régulières
                    </p>
                  </div>
                  
                  <div className="p-6 border border-border rounded-sm">
                    <Zap className="h-5 w-5 text-primary mb-4" />
                    <h4 className="font-semibold mb-2">Agilité</h4>
                    <p className="text-sm text-muted-foreground">
                      Itérations rapides et adaptation aux changements
                    </p>
                  </div>
                  
                  <div className="p-6 border border-border rounded-sm">
                    <BarChart className="h-5 w-5 text-primary mb-4" />
                    <h4 className="font-semibold mb-2">Qualité</h4>
                    <p className="text-sm text-muted-foreground">
                      Tests automatisés et revues de code rigoureuses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technologies">
            <Card>
              <CardHeader>
                <CardTitle>Stack Technologique</CardTitle>
                <CardDescription>
                  Technologies modernes et éprouvées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Next.js", category: "Frontend" },
                    { name: "React", category: "Frontend" },
                    { name: "TypeScript", category: "Langage" },
                    { name: "Tailwind CSS", category: "Styling" },
                    { name: "Node.js", category: "Backend" },
                    { name: "PostgreSQL", category: "Base de données" },
                    { name: "Docker", category: "DevOps" },
                    { name: "AWS", category: "Cloud" },
                  ].map((tech) => (
                    <div key={tech.name} className="p-4 border border-border rounded-sm">
                      <div className="font-semibold">{tech.name}</div>
                      <div className="text-xs text-muted-foreground">{tech.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    q: "Quel est votre délai moyen pour un projet ?",
                    a: "De 2 à 8 semaines selon la complexité du projet.",
                  },
                  {
                    q: "Proposez-vous des solutions de maintenance ?",
                    a: "Oui, des contrats de maintenance mensuels ou annuels sont disponibles.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="border border-border rounded-md p-10 md:p-12">
          <p className="path-label mb-3">~/contact</p>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Prêt à démarrer votre projet ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Discutons de votre projet et voyons comment je peux vous aider à atteindre vos objectifs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="rounded-sm">
              <Users className="mr-2 h-4 w-4" />
              Discuter d&apos;un projet
            </Button>
            <Button size="lg" variant="outline" className="rounded-sm">
              <Clock className="mr-2 h-4 w-4" />
              Réserver un appel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}