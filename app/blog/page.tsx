import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { formatDate } from '@/lib/utils';
import BlogList from '@/components/BlogList';

type Post = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  tags: string[];
};

function getBlogPosts(): Post[] {
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
        formattedDate: formatDate(data.date || '', false),
        excerpt: data.excerpt || '',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

function getAllTags(posts: Post[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export default function Blog() {
  const posts = getBlogPosts();
  const tags = getAllTags(posts);

  return <BlogList posts={posts} tags={tags} />;
}
