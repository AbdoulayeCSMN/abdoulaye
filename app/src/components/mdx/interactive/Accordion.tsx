'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@lib/utils';

interface AccordionProps { title: string; children: React.ReactNode; defaultOpen?: boolean }

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="my-4 border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 bg-muted/50 text-left text-sm font-semibold flex justify-between items-center hover:bg-muted transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && <div className="px-5 py-4 text-sm">{children}</div>}
    </div>
  );
}