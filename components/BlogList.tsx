'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  BLOG_LANG_STORAGE_KEY,
  DEFAULT_BLOG_LANG,
  isBlogLang,
  type BlogLang,
} from '@/lib/blog-lang';
import type { LocalizedPost } from '@/lib/blog';

type BlogListProps = {
  posts: LocalizedPost[];
  tags: Array<{ tag: string; count: number }>;
};

export default function BlogList({ posts, tags }: BlogListProps) {
  const [lang, setLang] = useState<BlogLang>(DEFAULT_BLOG_LANG);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem(BLOG_LANG_STORAGE_KEY);
    if (isBlogLang(stored)) setLang(stored);
  }, []);

  const filteredPosts = posts.filter(post => {
    const title = post.titles[lang];
    const excerpt = post.excerpts[lang];
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery === '' ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 mb-3"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                #{tag} <span style={{ color: '#aaaaaa' }}>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {filteredPosts.map(post => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/blog/${post.slug}/${lang}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 w-25 shrink-0 tabular-nums">
              {post.formattedDate}
            </p>
            <div className="flex flex-col">
              <p className="text-neutral-900 tracking-tight">{post.titles[lang]}</p>
              {post.excerpts[lang] && (
                <p className="text-neutral-600 text-sm">{post.excerpts[lang]}</p>
              )}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
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
          </div>
        </Link>
      ))}
    </div>
  );
}
