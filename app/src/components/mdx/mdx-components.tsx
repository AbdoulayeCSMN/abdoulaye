import { Quiz }      from '@components/mdx/interactive/Quiz';
import { Chart }     from '@components/mdx/interactive/Chart';
import { Mermaid }   from '@components/mdx/interactive/Mermaid';
import { Tabs, Tab } from '@components/mdx/interactive/Tabs';
import { Accordion } from '@components/mdx/interactive/Accordion';
import React from 'react';
import { cn } from '@lib/utils';

// Composants personnalisés pour le rendu MDX
export const MDXComponents = {
  // ... (composants existants : h1, h2, h3, p, ul, ol, li, blockquote, code, pre, table, th, td, a, hr, Callout, CodeBlock)
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'mt-8 mb-4 text-4xl font-bold tracking-tight scroll-m-20',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'mt-10 mb-4 text-3xl font-semibold tracking-tight scroll-m-20',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'mt-8 mb-4 text-2xl font-semibold tracking-tight scroll-m-20',
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'mb-4 mt-6 overflow-x-auto rounded-lg bg-muted p-4',
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn('font-medium text-primary underline underline-offset-4', className)}
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
  
  // Composant personnalisé Callout
  Callout: ({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'error' | 'success' }) => {
    const styles = {
      info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
      warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
      error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
      success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    };
    
    return (
      <div className={cn('my-6 rounded-lg border p-4', styles[type])}>
        {children}
      </div>
    );
  },
  
  // Composant personnalisé CodeBlock
  CodeBlock: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div className="my-6 overflow-hidden rounded-lg border">
      {title && (
        <div className="border-b bg-muted px-4 py-2 text-sm font-medium">
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  ),

  // ---------- NOUVEAUX COMPOSANTS POUR COURS PROFESSIONNELS ----------

  /**
   * Intégration vidéo (YouTube, Vimeo, etc.)
   * Utilisation : <Video src="https://youtu.be/..." title="Titre optionnel" />
   */
  Video: ({ src, title }: { src: string; title?: string }) => {
    const getEmbedUrl = (url: string) => {
      // YouTube
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      // Vimeo
      const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      // Si ce n'est ni YouTube ni Vimeo, on utilise l'URL telle quelle
      return url;
    };

    const embedUrl = getEmbedUrl(src);

    return (
      <div className="relative w-full aspect-video my-6">
        <iframe
          src={embedUrl}
          title={title || 'Vidéo'}
          className="absolute inset-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  },

  /**
   * Composant "Étapes" pour les tutoriels pas-à-pas
   * Utilisation : <Steps>{children}</Steps> où children sont des divs ou des éléments
   */
  Steps: ({ children }: { children: React.ReactNode }) => {
    const steps = React.Children.toArray(children).filter(React.isValidElement);
    return (
      <div className="my-6 ml-4 border-l-2 border-primary pl-6 space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-10 top-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="pt-1">{step}</div>
          </div>
        ))}
      </div>
    );
  },

  /**
   * Image avec légende (caption)
   * Utilisation : <ImageWithCaption src="/path.jpg" alt="description" caption="Légende" />
   */
  ImageWithCaption: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure className="my-6">
      <img src={src} alt={alt} className="rounded-lg mx-auto" />
      {caption && (
        <figcaption className="text-sm text-center text-muted-foreground mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  ),
  Quiz,
  Chart,
  Mermaid,
  Tabs,
  Tab,
  Accordion
};