import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { formatDate } from '@/lib/utils';
import WorkList from '@/components/WorkList';

type Project = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  tech: string;
  techArray: string[];
  link: string;
  pdf: string;
};

function getWorkProjects(): Project[] {
  const workDir = path.join(process.cwd(), 'content/work');
  const files = fs.readdirSync(workDir);

  const projects = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(workDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      const techString = data.tech || '';
      const techArray = techString ? techString.split(',').map((t: string) => t.trim()) : [];

      return {
        slug: file.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        formattedDate: formatDate(data.date || '', false),
        tech: techString,
        techArray,
        link: data.link || '',
        pdf: data.pdf || '',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return projects;
}

function getAllTechs(projects: Project[]): Array<{ tech: string; count: number }> {
  const techCount = new Map<string, number>();
  projects.forEach(project => {
    project.techArray.forEach(tech => {
      techCount.set(tech, (techCount.get(tech) || 0) + 1);
    });
  });
  return Array.from(techCount.entries())
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count);
}

export default function Work() {
  const projects = getWorkProjects();
  const techs = getAllTechs(projects);

  return <WorkList projects={projects} techs={techs} />;
}
