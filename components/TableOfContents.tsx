'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

type Heading = {
  id: string;
  level: number;
  text: string;
  raw: string;
};

const LEFT_POSITION = 'min(calc(50vw + 24rem + 1.5rem), calc(100vw - 18rem))';

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];

const inlineComponents: Components = {
  p: ({ children }) => <Fragment>{children}</Fragment>,
  strong: ({ children }) => <strong className="font-semibold text-neutral-800">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="text-neutral-400">{children}</del>,
  code({ children }) {
    return (
      <code className="px-1 rounded bg-neutral-200/70 text-neutral-800 font-mono text-xs">
        {children}
      </code>
    );
  },
};

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [top, setTop] = useState(128);

  useEffect(() => {
    const updateOffset = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      const computedTop = rect.top + window.scrollY + rect.height;
      setTop(Math.max(0, Math.round(computedTop)));
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  const handleNavigate = useCallback((event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const start = window.scrollY;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const offset = targetTop - start;
    const duration = 700;
    const ease = (t: number) => (t < 0.5
      ? 16 * Math.pow(t, 5)
      : 1 - Math.pow(-2 * t + 2, 5) / 2);
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = ease(progress);
      window.scrollTo({ top: start + offset * eased, behavior: 'auto' });
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        history.replaceState(null, '', `#${id}`);
      }
    };

    requestAnimationFrame(step);
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
                  onClick={event => handleNavigate(event, heading.id)}
                >
                  <ReactMarkdown
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    components={inlineComponents}
                  >
                    {heading.raw}
                  </ReactMarkdown>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
