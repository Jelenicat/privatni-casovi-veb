import fs from 'fs';
import path from 'path';

export default function Blog() {
  const blogDir = path.join(process.cwd(), 'blog');
  const files = fs.readdirSync(blogDir);

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
console.log("📝 Markdown fajlovi:", files);

}
