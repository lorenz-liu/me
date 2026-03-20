import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import type { ReactNode } from 'react';

const CALLOUT_TYPES: Record<string, { label: string; classes: string; icon: string }> = {
  NOTE:      { label: 'Note',      icon: 'ℹ',  classes: 'border-blue-400 bg-blue-50 text-blue-900' },
  TIP:       { label: 'Tip',       icon: '💡', classes: 'border-green-400 bg-green-50 text-green-900' },
  WARNING:   { label: 'Warning',   icon: '⚠',  classes: 'border-yellow-400 bg-yellow-50 text-yellow-900' },
  CAUTION:   { label: 'Caution',   icon: '🔥', classes: 'border-red-400 bg-red-50 text-red-900' },
  IMPORTANT: { label: 'Important', icon: '★',  classes: 'border-purple-400 bg-purple-50 text-purple-900' },
};

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in (node as object)) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

const components: Components = {
  // Callout-aware blockquote
  blockquote({ children }) {
    const childArray = Array.isArray(children) ? children : [children];
    const first = childArray.find(c => c && typeof c === 'object' && 'props' in (c as object));
    if (first) {
      const text = extractText((first as { props: { children?: ReactNode } }).props.children);
      const match = text.match(/^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/i);
      if (match) {
        const type = match[1].toUpperCase();
        const config = CALLOUT_TYPES[type];
        const rest = text.replace(/^\[!.*?\]\s*/, '');
        return (
          <div className={`my-4 border-l-4 rounded-r px-4 py-3 ${config.classes}`}>
            <div className="font-semibold text-sm mb-1">{config.icon} {config.label}</div>
            <div className="text-sm">{rest}</div>
          </div>
        );
      }
    }
    return (
      <blockquote className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4">
        {children}
      </blockquote>
    );
  },

  // External links open in new tab
  a({ href, children }) {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="underline underline-offset-2 hover:text-neutral-500 transition-colors"
      >
        {children}
      </a>
    );
  },

  // Code block with language label
  pre({ children }) {
    return (
      <pre className="relative rounded-lg overflow-x-auto text-sm my-4">
        {children}
      </pre>
    );
  },

  // Tables
  table({ children }) {
    return (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return <th className="border border-neutral-200 px-3 py-2 bg-neutral-50 font-semibold text-left">{children}</th>;
  },
  td({ children }) {
    return <td className="border border-neutral-200 px-3 py-2">{children}</td>;
  },

  // Lists
  ul({ children }) {
    return <ul className="list-disc ml-6 space-y-1 my-2">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal ml-6 space-y-1 my-2">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },

  // Headings
  h1({ children }) {
    return <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>;
  },
  h4({ children }) {
    return <h4 className="text-base font-semibold mt-4 mb-1">{children}</h4>;
  },

  // Paragraphs with increased spacing
  p({ children }) {
    return <p className="my-3 leading-relaxed">{children}</p>;
  },
};

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeRaw, rehypeKatex, rehypeHighlight];

export default function Markdown({
  content,
  inline = false,
  components: overrides,
}: {
  content: string;
  inline?: boolean;
  components?: Components;
}) {
  const merged: Components = {
    ...components,
    ...(inline ? { p: ({ children }) => <span>{children}</span> } : {}),
    ...overrides,
  };

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={merged}
    >
      {content}
    </ReactMarkdown>
  );
}
