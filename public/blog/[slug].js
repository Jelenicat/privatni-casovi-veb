import matter from 'gray-matter';
import { marked } from 'marked';

export default function BlogPost({ content, title, date }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{date}</p>
      <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pronadjiprofesora.com';
  const res = await fetch(`${siteUrl}/blog/${params.slug}.md`);
  const fileContent = await res.text();

  console.log("📝 Učitavanje blog posta:", params.slug, fileContent); // Debug log

  const { content, data } = matter(fileContent);

  return { props: { content, title: data.title || 'Blog Post', date: data.date || '' } };
}

export async function getStaticPaths() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pronadjiprofesora.com';
  const response = await fetch(`${siteUrl}/blog/list.json`);
  const files = await response.json();

  console.log("📝 Lista blog postova:", files); // Debug log

  const paths = files.map(file => ({ params: { slug: file.replace('.md', '') } }));

  return { paths, fallback: 'blocking' };
}
