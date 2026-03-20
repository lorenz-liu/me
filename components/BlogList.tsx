'use client';

import Link from 'next/link';
import { useState } from 'react';

type Post = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  tags: string[];
};

type BlogListProps = {
  posts: Post[];
  tags: string[];
};

export default function BlogList({ posts, tags }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filteredPosts = selectedTag === 'all'
    ? posts
    : posts.filter(post => post.tags.includes(selectedTag));

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
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
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
      {filteredPosts.map(post => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 w-25 shrink-0 tabular-nums">
              {post.formattedDate}
            </p>
            <div className="flex flex-col">
              <p className="text-neutral-900 tracking-tight">{post.title}</p>
              {post.excerpt && (
                <p className="text-neutral-600 text-sm">{post.excerpt}</p>
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
