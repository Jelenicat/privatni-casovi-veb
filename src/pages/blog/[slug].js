import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function BlogPost({ content, data }) {
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.date}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'blog', `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(fileContent);

  return { props: { content, data } };
}

export async function getStaticPaths() {
  const blogDir = path.join(process.cwd(), 'blog');
  const files = fs.readdirSync(blogDir);
  const paths = files.map(file => ({ params: { slug: file.replace('.md', '') } }));

  return { paths, fallback: false };
}
