
export default function CourseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="prose prose-neutral dark:prose-invert mx-7 max-w mx-auto py-1">
      {children}
    </div>
  );
}
