'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {cn} from '@lib/utils'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidProps {
  chart: string;
  className?: string;
}

const Mermaid = ({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.run({
        nodes: [ref.current],
      });
    }
  }, [chart]);

  return (
    <div className={cn('mermaid', className)} ref={ref}>
      {chart}
    </div>
  );
};

export default Mermaid;