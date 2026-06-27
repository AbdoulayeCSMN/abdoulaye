'use client';

import React from 'react';
import { cn } from '@lib/utils';

interface TabProps { label: string; children: React.ReactNode }

export function Tab({ children }: TabProps) {
  return <div>{children}</div>;
}

export function Tabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState(0);
  const tabs = React.Children.toArray(children).filter(
    (c) => React.isValidElement(c) && (c.type as any) === Tab
  ) as React.ReactElement<TabProps>[];

  return (
    <div className="my-6 rounded-xl border overflow-hidden">
      <div className="flex border-b bg-muted/40 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
              i === active
                ? 'border-b-2 border-primary text-primary bg-background'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="p-5">{tabs[active]}</div>
    </div>
  );
}