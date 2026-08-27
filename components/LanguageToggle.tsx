'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { BLOG_LANGS, BLOG_LANG_STORAGE_KEY, type BlogLang } from '@/lib/blog-lang';

const LABELS: Record<BlogLang, string> = {
  zh: '简中',
  en: 'English',
  fr: 'Français',
};

export default function LanguageToggle({ slug, lang }: { slug: string; lang: BlogLang }) {
  const activeIndex = BLOG_LANGS.indexOf(lang);

  useEffect(() => {
    localStorage.setItem(BLOG_LANG_STORAGE_KEY, lang);
  }, [lang]);

  return (
    <div
      className="relative grid grid-cols-3 rounded-full bg-[#eeeeee] p-[3px] shrink-0"
      role="radiogroup"
      aria-label="Language"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-[3px] bottom-[3px] left-[3px] w-[calc((100%-6px)/3)] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {BLOG_LANGS.map(locale => {
        const selected = locale === lang;
        return (
          <Link
            key={locale}
            href={`/blog/${slug}/${locale}`}
            role="radio"
            aria-checked={selected}
            className={`relative z-10 flex items-center justify-center px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold whitespace-nowrap rounded-full no-underline transition-colors ${
              selected ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {LABELS[locale]}
          </Link>
        );
      })}
    </div>
  );
}
