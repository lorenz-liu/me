'use client';

import Link from 'next/link';
import { useState } from 'react';

type Project = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  tech: string;
  techArray: string[];
  link: string;
};

type WorkListProps = {
  projects: Project[];
  techs: Array<{ tech: string; count: number }>;
};

export default function WorkList({ projects, techs }: WorkListProps) {
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = projects.filter(project => {
    const matchesTech = selectedTech === 'all' || project.techArray.includes(selectedTech);
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTech && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 mb-3"
        />
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTech === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {techs.map(({ tech, count }) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTech === tech
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tech} <span style={{ color: '#aaaaaa' }}>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {filteredProjects.map(project => (
        <Link
          key={project.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/work/${project.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 w-25 shrink-0 tabular-nums">
              {project.formattedDate}
            </p>
            <div className="flex flex-col">
              <p className="text-neutral-900 tracking-tight">{project.title}</p>
              {project.techArray.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.techArray.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-600"
                    >
                      {tech}
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
