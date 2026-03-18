import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const homeContent = `# Welcome

I'm a developer passionate about building great web experiences.

## Background

- Experience in web development
- Focus on modern technologies
- Always learning new things

## Skills

- **Frontend**: React, Next.js, TypeScript
- **Styling**: Tailwind CSS
- **Tools**: Git, VS Code

## Interests

When I'm not coding, I enjoy exploring new technologies and contributing to open source projects.
`;

export default function Home() {
  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {homeContent}
      </ReactMarkdown>
    </article>
  );
}
