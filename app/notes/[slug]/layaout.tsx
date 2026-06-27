export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pas de wrapper prose ici : la page de note gère son propre layout avec sidebar.
  // La page de liste de cours (CoursePage) est suffisamment auto-contenue.
  return <>{children}</>;
}