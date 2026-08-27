export const BLOG_LANGS = ['zh', 'en', 'fr'] as const;

export type BlogLang = (typeof BLOG_LANGS)[number];

export const DEFAULT_BLOG_LANG: BlogLang = 'zh';

export const BLOG_LANG_STORAGE_KEY = 'blog-lang';

export function isBlogLang(value: string | null | undefined): value is BlogLang {
  return !!value && (BLOG_LANGS as readonly string[]).includes(value);
}
