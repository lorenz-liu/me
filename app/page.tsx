import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from '@/components/Markdown';
import { formatDate } from '@/lib/utils';
import ArrowIcon from '@/components/ArrowIcon';

function getTimeline() {
  const filePath = path.join(process.cwd(), 'content/pages/timeline.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContent);

  // Parse the YAML-like content
  const lines = content.trim().split('\n');
  const timeline: Array<{ date: string; description: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- date:')) {
      const date = line.replace('- date:', '').trim().replace(/"/g, '');
      const descLine = lines[i + 1]?.trim();
      if (descLine && descLine.startsWith('description:')) {
        const description = descLine.replace('description:', '').trim().replace(/"/g, '');
        timeline.push({ date, description });
      }
      i++; // Skip the description line
    }
  }

  return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  const timeline = getTimeline();
  const homeContent = getHomeContent();
  const links = getLinks();

  return (
    <div>
    <ul>
    <div>
      <div className="mb-8 leading-relaxed prose prose-neutral max-w-none">
        <Markdown
          content={homeContent}
          bespoke={{
            p: { marginTop: '0.5rem', marginBottom: '0.5rem', lineHeight: '1.6' },
            ul: 'list-disc ml-6 space-y-0.5 my-1',
            ol: 'list-decimal ml-6 space-y-0.5 my-1',
            li: { lineHeight: '1.6' },
          }}
        />
      </div>

      <div className="mb-8">
        {timeline.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row mb-2 gap-2">
            <p className="text-neutral-600 tabular-nums w-30 shrink-0 text-sm">
              {formatDate(item.date, false)}
            </p>
            <div className="text-neutral-900 tracking-tight text-sm prose prose-neutral prose-sm max-w-none">
              <Markdown
                content={item.description}
                inline
                components={{
                  strong: ({ children }) => <span className="italic">{children}</span>,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowIcon />
            <p className="ml-2">github</p>
          </a>
        )}
        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowIcon />
            <p className="ml-2">linkedin</p>
          </a>
        )}
      </div>
    </div>
    </ul>
  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
    © {new Date().getFullYear()} GNU GENERAL PUBLIC LICENSE
  </p>
    </div>
  );
}
