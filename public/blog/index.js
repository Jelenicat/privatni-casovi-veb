import { useState, useEffect } from 'react';

export default function Blog() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const res = await fetch('/blog/list.json'); // Pretpostavka da postoji list.json sa spiskom fajlova
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error("❌ Greška pri učitavanju blog postova:", error);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {files.map(file => (
          <li key={file}>
            <a href={`/blog/${file.replace('.md', '')}`}>{file.replace('.md', '')}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
