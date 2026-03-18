import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { formatDate } from '@/lib/utils';

function ArrowIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="#999999"
      />
    </svg>
  )
}

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
      <p className="mb-8 leading-relaxed">
        {homeContent}
      </p>

      <div className="mb-8">
        {timeline.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row mb-4 gap-2">
            <p className="text-neutral-600 tabular-nums md:w-[25%] flex-shrink-0 text-sm">
              {formatDate(item.date, false)}
            </p>
            <div className="text-neutral-900 tracking-tight md:w-[75%] text-sm prose prose-neutral prose-sm max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <span>{children}</span>,
                  strong: ({ children }) => <span className="italic">{children}</span>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  u: ({ children }) => <span className="underline">{children}</span>,
                }}
              >
                {item.description}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex gap-4">
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
