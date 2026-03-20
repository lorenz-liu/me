import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

function getBlogPosts() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir);

  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      return {
        slug: file.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

function getAllTags(posts: ReturnType<typeof getBlogPosts>) {
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export default function Blog({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const allPosts = getBlogPosts();
  const allTags = getAllTags(allPosts);
  const selectedTag = searchParams.tag;

  const posts = selectedTag
    ? allPosts.filter(post => post.tags.includes(selectedTag))
    : allPosts;

  return (
    <div>
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/blog"
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              !selectedTag
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All
          </Link>
          {allTags.map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      {posts.map(post => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 w-25 shrink-0 tabular-nums">
              {formatDate(post.date, false)}
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
                      {tag}
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
