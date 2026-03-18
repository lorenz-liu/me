import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function getResumeContent() {
  const filePath = path.join(process.cwd(), 'content/pages/resume.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContent);
  return content;
}

export default function Resume() {
  const resumeContent = getResumeContent();

  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {resumeContent}
      </ReactMarkdown>
    </article>
  );
}
