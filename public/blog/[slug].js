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
  // Koristi fetch umesto fs
  const res = await fetch(`https://www.pronadjiprofesora.com/blog/${params.slug}.md`);
  const fileContent = await res.text();
  const { content, data } = matter(fileContent);

  return { props: { content, data } };
}

export async function getStaticPaths() {
  const response = await fetch(`https://www.pronadjiprofesora.com/blog/`);
  const files = await response.json(); // Pretpostavka da vraća listu fajlova
  
  const paths = files.map(file => ({ params: { slug: file.replace('.md', '') } }));

  return { paths, fallback: false };
}
