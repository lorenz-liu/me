import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const resumeContent = `# Resume

## Experience

### Senior Frontend Developer
**Tech Company** • 2022 - Present

- Led development of customer-facing web applications using React and Next.js
- Improved application performance by 40% through code optimization
- Mentored junior developers and conducted code reviews
- Collaborated with design team to implement responsive UI components

### Frontend Developer
**Startup Inc** • 2020 - 2022

- Built and maintained multiple client projects using modern JavaScript frameworks
- Implemented CI/CD pipelines for automated testing and deployment
- Worked closely with backend team to integrate RESTful APIs
- Contributed to open source projects

## Education

### Bachelor of Science in Computer Science
**University Name** • 2016 - 2020

- Focus on software engineering and web technologies
- Graduated with honors

## Skills

### Frontend
- React, Next.js, TypeScript, JavaScript
- HTML5, CSS3, Tailwind CSS
- State Management (Redux, Zustand)

### Backend
- Node.js, Express
- PostgreSQL, MongoDB
- RESTful APIs, GraphQL

### Tools & Others
- Git, GitHub, GitLab
- Docker, CI/CD
- Agile/Scrum methodologies

## Projects

### Personal Website
Built a minimal portfolio website with markdown support using Next.js and TypeScript.

### E-commerce Platform
Developed a full-stack e-commerce solution with payment integration and admin dashboard.

## Contact

- Email: your.email@example.com
- GitHub: github.com/yourusername
- LinkedIn: linkedin.com/in/yourusername
`;

export default function Resume() {
  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {resumeContent}
      </ReactMarkdown>
    </article>
  );
}
