import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Markdown from '@/components/Markdown';

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
      <div className="text-sm text-gray-500 mb-8">
        <span>{data.date}</span>
        {data.tech && <span> • {data.tech}</span>}
        {data.pdf && (
          <>
            {' • '}
            <a href={data.pdf} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              Read the Paper
            </a>
          </>
        )}
        {data.link && (
          <>
            {' • '}
            <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
              External Link
            </a>
          </>
        )}
      </div>
      <Markdown content={content} />
    </article>
  );
}
