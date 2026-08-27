import { JSX, ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from '@/components/Markdown';
import TableOfContents from '@/components/TableOfContents';
import LanguageToggle from '@/components/LanguageToggle';
import { getBlogSlugs, getPost } from '@/lib/blog';
import { BLOG_LANGS, isBlogLang, type BlogLang } from '@/lib/blog-lang';
import { formatDate } from '@/lib/utils';

type Heading = {
  id: string;
  level: number;
  text: string;
  raw: string;
};

const HEADING_REGEX = /^(#{2,4})\s+(.+)$/gm;

function slugify(value: string) {
  const noHtml = value.replace(/<[^>]*>/g, '');
  const normalized = noHtml
    .trim()
    .toLowerCase()
    .replace(/["'`]+/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
  return normalized || 'section';
}

function createSlugger() {
  const counts = new Map<string, number>();
  return (value: string) => {
    const base = slugify(value);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen}`;
  };
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const slugger = createSlugger();
  let match: RegExpExecArray | null;

  while ((match = HEADING_REGEX.exec(markdown))) {
    const level = match[1].length;
    const rawText = match[2].trim();
    if (!rawText) continue;
    const text = rawText.replace(/[#*`]+/g, '').trim();
    headings.push({
      level,
      text,
      id: slugger(text),
      raw: rawText,
    });
  }

  return headings;
}

function flattenText(node?: ReactNode): string {
  if (node === undefined || node === null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const anyNode = node as { props?: { children?: ReactNode } };
    return flattenText(anyNode.props?.children);
  }
  return '';
}

function makeHeadingComponent(
  tag: 'h2' | 'h3' | 'h4',
  className: string,
  slugger: ReturnType<typeof createSlugger>,
) {
  const Heading = ({ children }: { children?: ReactNode }) => {
    const text = flattenText(children);
    const id = text ? slugger(text) : undefined;
    const Tag = tag as keyof JSX.IntrinsicElements;
    return (
      <Tag id={id} className={`${className} scroll-mt-24`}>
        {children}
      </Tag>
    );
  };
  Heading.displayName = `Markdown${tag.toUpperCase()}`;
  return Heading;
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.flatMap(slug =>
    BLOG_LANGS.map(lang => ({
      slug,
      lang,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang: langParam } = await params;
  if (!isBlogLang(langParam)) return {};
  const post = getPost(slug, langParam);
  return { title: post.title };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang: langParam } = await params;
  if (!isBlogLang(langParam)) notFound();
  const lang = langParam as BlogLang;

  const post = getPost(slug, lang);
  const headings = extractHeadings(post.content);
  const headingSlugger = createSlugger();

  const headingOverrides = {
    h2: makeHeadingComponent('h2', 'text-2xl font-semibold mt-6 mb-3', headingSlugger),
    h3: makeHeadingComponent('h3', 'text-xl font-semibold mt-5 mb-2', headingSlugger),
    h4: makeHeadingComponent('h4', 'text-base font-semibold mt-4 mb-1', headingSlugger),
  } as const;

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          href="/blog"
          className="text-sm text-gray-600 hover:text-black no-underline inline-block shrink-0"
        >
          ← Back to blog
        </Link>
        <LanguageToggle slug={slug} lang={lang} />
      </div>
      <article className="prose prose-neutral max-w-none">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 mb-8">
          <time className="text-sm text-gray-500">{formatDate(post.date, false)}</time>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <Markdown content={post.content} components={headingOverrides} />
      </article>

      <TableOfContents headings={headings} />
    </div>
  );
}
