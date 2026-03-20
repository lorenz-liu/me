import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

function getWorkProjects() {
  const workDir = path.join(process.cwd(), 'content/work');
  const files = fs.readdirSync(workDir);

  const projects = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(workDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      return {
        slug: file.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        tech: data.tech || '',
        link: data.link || '',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return projects;
}

export default function Work() {
  const projects = getWorkProjects();

  return (
    <div>
      {projects.map(project => (
        <Link
          key={project.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/work/${project.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 w-25 shrink-0 tabular-nums">
              {formatDate(project.date, false)}
            </p>
            <div className="flex flex-col">
              <p className="text-neutral-900 tracking-tight">{project.title}</p>
              {project.tech && (
                <p className="text-neutral-600 text-sm">{project.tech}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
