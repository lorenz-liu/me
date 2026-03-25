'use client';

import { useEffect, useState } from 'react';

type Heading = {
  id: string;
  level: number;
  text: string;
};

const LEFT_POSITION = 'min(calc(50vw + 24rem + 1.5rem), calc(100vw - 18rem))';

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [top, setTop] = useState(128);

  useEffect(() => {
    const updateOffset = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      const navBottom = rect.top + window.scrollY + rect.height;
      setTop(Math.max(0, Math.round(navBottom)));
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  if (!headings.length) return null;

  return (
    <aside
      className="hidden xl:block fixed"
      style={{ top: `${top}px`, left: LEFT_POSITION }}
    >
      <div className="w-64 text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
          Table of contents
        </p>
        <nav>
          <ul className="space-y-2">
            {headings.map(heading => (
              <li
                key={heading.id}
                className="leading-snug"
                style={{ marginLeft: `${Math.max(0, heading.level - 2) * 12}px` }}
              >
                <a
                  href={`#${heading.id}`}
                  className="block rounded text-neutral-600 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
