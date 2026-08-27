import { getBlogPosts } from '@/lib/blog';
import BlogList from '@/components/BlogList';
import type { LocalizedPost } from '@/lib/blog';

function getAllTags(posts: LocalizedPost[]): Array<{ tag: string; count: number }> {
  const tagCount = new Map<string, number>();
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export default function Blog() {
  const posts = getBlogPosts();
  const tags = getAllTags(posts);

  return <BlogList posts={posts} tags={tags} />;
}
