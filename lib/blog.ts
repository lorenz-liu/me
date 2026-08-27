import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { formatDate } from '@/lib/utils';
import { BLOG_LANGS, DEFAULT_BLOG_LANG, type BlogLang } from '@/lib/blog-lang';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type BlogPost = {
  slug: string;
  lang: BlogLang;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
};

export type LocalizedPost = {
  slug: string;
  date: string;
  formattedDate: string;
  tags: string[];
  titles: Record<BlogLang, string>;
  excerpts: Record<BlogLang, string>;
};

export function getBlogSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter(name => fs.statSync(path.join(BLOG_DIR, name)).isDirectory())
    .sort();
}

export function getPost(slug: string, lang: BlogLang): BlogPost {
  const filePath = path.join(BLOG_DIR, slug, `${lang}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    lang,
    title: (data.title as string) || 'Untitled',
    date: (data.date as string) || '',
    excerpt: (data.excerpt as string) || '',
    tags: (data.tags as string[]) || [],
    content,
  };
}

export function getBlogPosts(): LocalizedPost[] {
  return getBlogSlugs()
    .map(slug => {
      const versions = Object.fromEntries(
        BLOG_LANGS.map(lang => [lang, getPost(slug, lang)]),
      ) as Record<BlogLang, BlogPost>;
      const date = versions[DEFAULT_BLOG_LANG].date || versions.en.date;

      return {
        slug,
        date,
        formattedDate: formatDate(date, false),
        tags: versions[DEFAULT_BLOG_LANG].tags.length
          ? versions[DEFAULT_BLOG_LANG].tags
          : versions.en.tags,
        titles: {
          zh: versions.zh.title,
          en: versions.en.title,
          fr: versions.fr.title,
        },
        excerpts: {
          zh: versions.zh.excerpt,
          en: versions.en.excerpt,
          fr: versions.fr.excerpt,
        },
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
