"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function Toc() {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll("article h2, article h3")
    ) as HTMLElement[];

    const tocItems: TocItem[] = headings.map((h) => ({
      id: h.id,
      text: h.innerText,
      level: h.tagName === "H2" ? 2 : 3,
    }));

    setToc(tocItems);
  }, []);

  if (!toc.length) return null;

  return (
    <div className="p-2">
      <h3 className="text-sm font-semibold mb-2">Sommaire</h3>
      <ul className="flex flex-col gap-1 text-sm">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              className="hover:text-primary transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
