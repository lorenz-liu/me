'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BLOG_LANG_STORAGE_KEY, DEFAULT_BLOG_LANG, isBlogLang } from '@/lib/blog-lang';

export default function BlogLangRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(BLOG_LANG_STORAGE_KEY);
    const lang = isBlogLang(stored) ? stored : DEFAULT_BLOG_LANG;
    router.replace(`/blog/${slug}/${lang}`);
  }, [slug, router]);

  return (
    <p className="text-sm text-neutral-500">…</p>
  );
}
