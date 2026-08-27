import BlogLangRedirect from '@/components/BlogLangRedirect';
import { getBlogSlugs } from '@/lib/blog';

export async function generateStaticParams() {
  return getBlogSlugs().map(slug => ({ slug }));
}

export default async function BlogPostRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogLangRedirect slug={slug} />;
}
