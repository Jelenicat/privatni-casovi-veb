import matter from 'gray-matter';
import { marked } from 'marked';

export default function BlogPost({ content }) {
  return (
    <div>
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(content.body) }} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pronadjiprofesora.com';
  const res = await fetch(`${siteUrl}/blog/${params.slug}.md`);
  const fileContent = await res.text();

  const { content, data } = matter(fileContent);
  
  console.log("📝 Blog post:", params.slug, content);

  return { props: { content: data, body: content } };
}

export async function getStaticPaths() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pronadjiprofesora.com';
  const response = await fetch(`${siteUrl}/blog/list.json`);
  const files = await response.json();

  const paths = files.map(file => ({ params: { slug: file.replace('.md', '') } }));

  return { paths, fallback: false };
}
