import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir);

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace('.md', ''),
    }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return (
    <article className="prose prose-neutral max-w-none">
      <Link href="/blog" className="text-sm text-gray-600 hover:text-black no-underline mb-4 inline-block">
        ← Back to blog
      </Link>
      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      <time className="text-sm text-gray-500 block mb-8">{data.date}</time>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
