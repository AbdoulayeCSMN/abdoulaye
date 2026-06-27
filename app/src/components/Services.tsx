import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import Link from "next/link";
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
  TrendingUp,
  BarChart,
  Target
} from "lucide-react"

const services = [
  {
    id: 1,
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
    popular: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
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
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
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
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
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
    popular: true,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
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
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: 6,
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
    color: "from-indigo-500 to-blue-500",
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
    <div className="min-h-screen bg-linear-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Services Professionnels</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Solutions Digitales Sur Mesure
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
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                service.popular ? "border-2 border-primary" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br ${service.color} mb-4`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
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
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <div className="text-2xl font-bold">{service.price}</div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Discuter du projet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Processus */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mon Processus de Travail</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une méthodologie éprouvée pour garantir la réussite de votre projet.
            </p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/50 to-primary transform md:-translate-x-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
              {processSteps.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 md:mt-16'}`}
                >
                  <div className={`absolute top-0 ${
                    index % 2 === 0 
                      ? 'md:right-0 md:transform md:translate-x-1/2' 
                      : 'md:left-0 md:transform md:-translate-x-1/2'
                  }`}>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <div className="text-white font-bold">{step.step}</div>
                    </div>
                  </div>
                  
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-primary">
                          {step.icon}
                        </div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Phase {step.step} sur 5
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs pour les détails supplémentaires */}
        <Tabs defaultValue="methodology" className="mb-16">
          <TabsList className="grid grid-cols-3 mb-8">
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
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Collaboration</h4>
                    <p className="text-sm text-muted-foreground">
                      Communication transparente et revues régulières
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Agilité</h4>
                    <p className="text-sm text-muted-foreground">
                      Itérations rapides et adaptation aux changements
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
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
                    <div key={tech.name} className="text-center p-4 border rounded-lg">
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
                  {
                    q: "Travaillez-vous avec des entreprises internationales ?",
                    a: "Absolument, je travaille avec des clients du monde entier, principalement en Europe et Amérique du Nord.",
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
        <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discutons de votre projet et voyons comment je peux vous aider à atteindre vos objectifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Users className="mr-2 h-4 w-4" />
                Discuter d&apos;un projet
              </Button>
              <Button size="lg" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Réserver un appel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}