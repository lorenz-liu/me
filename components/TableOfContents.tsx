'use client';

import { useEffect, useState } from 'react';
import katex from 'katex';

type Heading = {
  id: string;
  level: number;
  text: string;
};

const LEFT_POSITION = 'min(calc(50vw + 24rem + 1.5rem), calc(100vw - 18rem))';

function renderHeadingLabel(text: string) {
  const parts: Array<{ type: 'text' | 'math'; value: string }> = [];
  const mathRegex = /\$(.+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'math', value: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return text;
  }

  return parts.map((part, index) => {
    if (part.type === 'text') {
      return (
        <span key={`text-${index}`}>
          {part.value}
        </span>
      );
    }

    return (
      <span
        key={`math-${index}`}
        className="inline-block align-middle"
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(part.value, { throwOnError: false }),
        }}
      />
    );
  });
}

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
                  {renderHeadingLabel(heading.text)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
