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
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return posts;
}

function getHomeContent() {
  const filePath = path.join(process.cwd(), 'content/pages/home.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContent);
  return content;
}

function getLinks() {
  const filePath = path.join(process.cwd(), 'content/pages/links.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);
  return data;
}

export default function Home() {
  const recentPosts = getBlogPosts();
  const homeContent = getHomeContent();
  const links = getLinks();

  return (
    <div>
      <p className="mb-8 leading-relaxed">
        {homeContent}
      </p>

      <div className="mb-8">
        {recentPosts.map(post => (
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

      <div className="flex gap-4 text-sm">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <span>↗</span>
            <span>github</span>
          </a>
        )}
        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <span>↗</span>
            <span>linkedin</span>
          </a>
        )}
      </div>
    </div>
  );
}
