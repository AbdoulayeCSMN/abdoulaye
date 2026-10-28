import About from "@components/About";
import type { Lang } from "@lib/about-content";

// Contenu lu en base à chaque requête : une modification dans l'admin est visible tout de suite.
export const dynamic = "force-dynamic";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <About locale={locale === "en" ? "en" : ("fr" as Lang)} />;
}
