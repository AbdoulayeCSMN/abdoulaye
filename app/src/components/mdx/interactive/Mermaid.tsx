'use client';

import React from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = React.useState<string>('');
  const [error, setError] = React.useState(false);
  const id = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    if (!chart) return;
    import('mermaid').then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({ startOnLoad: false, theme: 'base', securityLevel: 'loose' });
      mermaid.render(`mermaid-${id}`, chart)
        .then(({ svg }) => setSvg(svg))
        .catch(() => setError(true));
    });
  }, [chart, id]);

  if (error) return (
    <div className="my-6 p-4 border border-red-300 rounded-lg text-sm text-red-600">
      Erreur de rendu Mermaid.
    </div>
  );

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto rounded-xl border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: svg || '<span class="text-muted-foreground text-sm animate-pulse">Rendu…</span>' }}
    />
  );
}