import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Markdown from '@/components/Markdown';
import ArrowIcon from '@/components/ArrowIcon';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const workDir = path.join(process.cwd(), 'content/work');
  const files = fs.readdirSync(workDir);

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace('.md', ''),
    }));
}

export default async function WorkProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/work', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return (
    <article className="prose prose-neutral max-w-none">
      <Link href="/work" className="text-sm text-gray-600 hover:text-black no-underline mb-4 inline-block">
        ← Back to work
      </Link>
      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      <div className="text-sm mb-8">
        {data.tech && (
          <div className="flex flex-wrap gap-1 mb-2">
            {data.tech.split(',').map((tech: string) => (
              <span
                key={tech.trim()}
                className="px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-600"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        )}
        {(data.pdf || data.link) && (
          <div className="flex gap-3 mb-2 text-gray-600">
            {data.pdf && (
              <a href={data.pdf} target="_blank" rel="noopener noreferrer" className="hover:text-black underline flex items-center gap-1.5">
                <ArrowIcon />
                Read the Paper
              </a>
            )}
            {data.link && (
              <a href={data.link} target="_blank" rel="noopener noreferrer" className="hover:text-black underline flex items-center gap-1.5">
                <ArrowIcon />
                External Link
              </a>
            )}
          </div>
        )}
        <div className="text-gray-500">{formatDate(data.date, false)}</div>
      </div>
      <Markdown content={content} />
    </article>
  );
}
