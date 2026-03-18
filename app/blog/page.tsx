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
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export default function Blog() {
  const posts = getBlogPosts();

  return (
    <div>
      {posts.map(post => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 w-[100px] tabular-nums">
              {formatDate(post.date, false)}
            </p>
            <p className="text-neutral-900 tracking-tight">
              {post.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
